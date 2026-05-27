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
import { logMessage } from "../utils/logger";

type ExtendedPatch = SanityInternetResourcePatch & {
  aiAuditStamp: string;
  skipLinkCheck?: boolean;
};

export async function handleAiContentReview(env: Env, limit: number) {
  logMessage("ai_content_review_start", "starting");

  const taxonomyDocs = await getReferenceTaxonomies(env);
  const resourceDocs = await getAuditableDocsByTypes(
    env,
    [...INTERNET_RESOURCE_TYPES],
    limit,
  );

  const docPatches: Record<string, ExtendedPatch> = {};
  const docCreates: Array<SanityDocument> = [];

  // Determine audit actions
  const settledAuditActions = await Promise.allSettled(
    resourceDocs.map((doc) => getAuditActionForDoc(env, doc)),
  );

  const docsForAiReview: Array<{ doc: SanityDocument; content: string }> = [];
  for (let i = 0; i < settledAuditActions.length; i++) {
    const doc = resourceDocs[i];
    const result = settledAuditActions[i];

    if (result.status === "rejected") {
      logMessage("ai_content_review_doc_audit_outcome", {
        docId: doc._id,
        status: "fail",
        reason: result.reason,
      });
      continue;
    }

    const auditAction = result.value;

    logMessage("ai_content_review_doc_audit_outcome", {
      docId: doc._id,
      status: "success",
      action: auditAction.action,
    });

    if (auditAction.action === "disable") {
      docPatches[auditAction.id] = {
        aiAuditStamp: generateKey(),
        skipLinkCheck: true,
      };
      continue;
    }

    if (auditAction.action === "skip") {
      docPatches[auditAction.id] = {
        aiAuditStamp: generateKey(),
      };
      continue;
    }

    docsForAiReview.push({ doc, content: auditAction.content });
  }

  const settledAiReviews = await Promise.allSettled(
    docsForAiReview.map((doc) =>
      getAiReview(env, doc.doc, doc.content, taxonomyDocs),
    ),
  );

  for (let i = 0; i < settledAiReviews.length; i++) {
    const result = settledAiReviews[i];
    const doc = docsForAiReview[i];

    if (result.status === "rejected") {
      logMessage("ai_content_review_ai_review_outcome", {
        docId: doc.doc._id,
        status: "fail",
        reason: result.reason,
      });

      continue;
    }

    const reviewAction = result.value;
    logMessage("ai_content_review_ai_review_outcome", {
      docId: doc.doc._id,
      status: "success",
      detail: reviewAction.patch === null ? "no patch" : "patch provided",
    });

    const aiAuditStamp = { aiAuditStamp: generateKey() };
    if (reviewAction.patch === null) {
      docPatches[reviewAction.id] = aiAuditStamp;
      continue;
    }

    // Also patch the live doc so _updatedAt advances even if the draft is
    // later discarded — otherwise the doc returns to the front of the audit
    // queue and we re-run the same review.
    docPatches[reviewAction.id] = aiAuditStamp;
    const newDoc = getSanityDocFromReviewAction(doc.doc, reviewAction.patch);
    docCreates.push({ ...newDoc, ...aiAuditStamp });
  }

  const sanityClient = getSanityClient(env);

  const transaction = sanityClient.transaction();

  Object.entries(docPatches).forEach(([docId, patch]) =>
    transaction.patch(docId, (p) => p.set(patch)),
  );

  // We're failing silently if a draft already exists; should be fine given we should be excluding drafts to begin with
  docCreates.forEach((doc) => {
    return transaction.createIfNotExists(doc);
  });

  try {
    const results = await transaction.commit({ visibility: "async" });
    logMessage(
      "ai_content_review_ai_sanity_transaction_result",
      results.results.map((r) => `${r}\n`),
    );
  } catch (error) {
    logMessage(
      "ai_content_review_ai_sanity_transaction_result",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}
