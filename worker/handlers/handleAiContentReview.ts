import type { SanityDocument } from "sanity";
import { INTERNET_RESOURCE_TYPES } from "../../constants";
import {
  generateKey,
  getAuditableDocsByTypes,
  getReferenceTaxonomies,
  getSanityClient,
  getSanityDocFromReviewAction,
  type SanityInternetResourcePatch,
} from "../utils/sanity";
import { getAuditActionForDoc } from "../ai-content-editor";
import { getAiReview } from "../ai-content-editor/ai-review";
import { logger } from "../utils/logger";

type ExtendedPatch = SanityInternetResourcePatch & {
  aiAuditStamp: string;
  skipLinkCheck?: boolean;
  skipLinkCheckReason?: string;
};

function formatDisableReason(
  reason: "robots" | "http_client_error",
  detail: string | undefined,
): string {
  switch (reason) {
    case "robots":
      return "Disallowed by robots.txt";
    case "http_client_error":
      return detail
        ? `HTTP ${detail} from source URL`
        : "HTTP client error from source URL";
  }
}

// Each action becomes one per-doc transaction. The published-doc patch is
// guarded by ifRevisionId so that if the doc was modified between query and
// commit, the whole transaction fails atomically — no stale draft is created.
type DocAction = {
  publishedId: string;
  publishedRev: string;
  patch: ExtendedPatch;
  draft?: SanityDocument;
};

export async function handleAiContentReview(env: Env, limit: number) {
  logger.info("ai_content_review_start", "starting");

  try {
    await runAiContentReview(env, limit);
  } catch (error) {
    // Swallow so Cloudflare doesn't retry the scheduled trigger and re-spend
    // on Jina + Anthropic for the same batch.
    logger.error(
      "ai_content_review_fatal",
      error instanceof Error ? error.message : String(error),
    );
  }
}

async function runAiContentReview(env: Env, limit: number) {
  const resourceDocs = await getAuditableDocsByTypes(
    env,
    [...INTERNET_RESOURCE_TYPES],
    limit,
  );

  if (resourceDocs.length === 0) {
    logger.info("ai_content_review_empty_batch", "no eligible docs");
    return;
  }

  const taxonomyDocs = await getReferenceTaxonomies(env);

  // Determine audit actions
  const settledAuditActions = await Promise.allSettled(
    resourceDocs.map((doc) => getAuditActionForDoc(env, doc)),
  );

  // Track Sanity mutations
  const docActions: DocAction[] = [];
  const docsForAiReview: Array<{ doc: SanityDocument; content: string }> = [];

  for (let i = 0; i < settledAuditActions.length; i++) {
    const doc = resourceDocs[i];
    const result = settledAuditActions[i];

    if (result.status === "rejected") {
      logger.warn("ai_content_review_doc_audit_outcome", {
        docId: doc._id,
        status: "fail",
        reason: result.reason,
      });
      continue;
    }

    const auditAction = result.value;

    logger.info("ai_content_review_doc_audit_outcome", {
      docId: doc._id,
      status: "success",
      action: auditAction.action,
    });

    if (auditAction.action === "disable") {
      docActions.push({
        publishedId: doc._id,
        publishedRev: doc._rev,
        patch: {
          aiAuditStamp: generateKey(),
          skipLinkCheck: true,
          skipLinkCheckReason: formatDisableReason(
            auditAction.reason,
            auditAction.detail,
          ),
        },
      });
      continue;
    }

    if (auditAction.action === "skip") {
      docActions.push({
        publishedId: doc._id,
        publishedRev: doc._rev,
        patch: { aiAuditStamp: generateKey() },
      });
      continue;
    }

    docsForAiReview.push({ doc, content: auditAction.content });
  }

  // Serialize Anthropic calls to stay under the ITPM limit. Each iteration
  // enforces a minimum wall-clock gap between request starts; if the request
  // itself took longer than the gap, we proceed immediately.
  for (let i = 0; i < docsForAiReview.length; i++) {
    const doc = docsForAiReview[i];
    const isLast = i === docsForAiReview.length - 1;
    const startedAt = Date.now();

    try {
      const reviewAction = await getAiReview(
        env,
        doc.doc,
        doc.content,
        taxonomyDocs,
      );

      const aiAuditStampPatch = { aiAuditStamp: generateKey() };

      // We have no update to apply
      if (
        reviewAction.patch === null ||
        Object.keys(reviewAction.patch).length === 0
      ) {
        logger.info("ai_content_review_ai_review_outcome", {
          docId: doc.doc._id,
          status: "success",
          detail: reviewAction.patch === null ? "parse failed" : "no changes",
        });

        docActions.push({
          publishedId: doc.doc._id,
          publishedRev: doc.doc._rev,
          patch: aiAuditStampPatch,
        });

        continue;
      }

      logger.info("ai_content_review_ai_review_outcome", {
        docId: doc.doc._id,
        status: "success",
        detail: "patch provided",
      });

      const newDoc = getSanityDocFromReviewAction(doc.doc, reviewAction.patch);
      docActions.push({
        publishedId: doc.doc._id,
        publishedRev: doc.doc._rev,
        patch: aiAuditStampPatch,
        draft: { ...newDoc, ...aiAuditStampPatch },
      });
    } catch (error) {
      logger.warn("ai_content_review_ai_review_outcome", {
        docId: doc.doc._id,
        status: "fail",
        reason: error instanceof Error ? error.message : String(error),
      });
    }

    // We want to create a delay between requests to avoid Claude API rate limits on Tier 1
    if (!isLast) {
      const elapsed = Date.now() - startedAt;
      const remaining = env.AI_REVIEW_MIN_GAP_MS - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
    }
  }

  const sanityClient = getSanityClient(env);

  const settledCommits = await Promise.allSettled(
    docActions.map((action) => {
      const tx = sanityClient
        .transaction()
        .patch(action.publishedId, (p) =>
          p.ifRevisionId(action.publishedRev).set(action.patch),
        );
      if (action.draft) {
        tx.createIfNotExists(action.draft);
      }
      return tx.commit({ visibility: "async" });
    }),
  );

  for (let i = 0; i < settledCommits.length; i++) {
    const action = docActions[i];
    const result = settledCommits[i];
    if (result.status === "rejected") {
      logger.warn("ai_content_review_sanity_commit_outcome", {
        docId: action.publishedId,
        status: "fail",
        reason:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      });
      continue;
    }
    logger.info("ai_content_review_sanity_commit_outcome", {
      docId: action.publishedId,
      status: "success",
    });
  }
}
