import { internetResourceTypes } from "../../shared/internet-resource";
import {
  getOldestPublishedDocsByTypes,
  getReferenceTaxonomies,
  getSanityClient,
} from "../sanity/client";
import {
  getBaseMutationDescriptor,
  getDraftDocumentFromAiReview,
  draftHasChanges,
  type SanityMutationDescriptor,
} from "../sanity/utils";
import { logger } from "../utils/logger";
import { type ReviewInput, getAiReview } from "./ai-review";
import {
  getDocumentContent,
  getDocumentActionFromContentResult,
} from "./content";

export async function runAiContentReview(env: Env, limit: number) {
  // Fetch the docs to audit
  const resourceDocs = await getOldestPublishedDocsByTypes(
    env,
    [...internetResourceTypes],
    limit,
  );

  if (resourceDocs.length === 0) {
    logger.info("runAiContentReview", "no eligible docs");
    return;
  }

  // Get page content for documents
  const settledDocContentResults = await Promise.allSettled(
    resourceDocs.map((doc) => getDocumentContent(env, doc)),
  );

  // Track Sanity mutations
  const docMutationDescriptors: Array<SanityMutationDescriptor> = [];
  const docsForAiReview: Array<ReviewInput> = [];

  // Process settled Doc Content promises
  for (let i = 0; i < settledDocContentResults.length; i++) {
    const doc = resourceDocs[i];
    const result = settledDocContentResults[i];

    // Process rejected promises
    if (result.status !== "fulfilled") {
      logger.warn("runAiContentReview", {
        docId: doc._id,
        detail: `[getDocumentContent] promise rejected: ${result.reason}`,
      });
      continue;
    }

    const docAction = getDocumentActionFromContentResult(result.value);

    if (docAction.action !== "review") {
      const baseMutation = getBaseMutationDescriptor(doc);

      if (docAction.action === "disable") {
        docMutationDescriptors.push({
          ...baseMutation,
          pubPatch: {
            ...baseMutation.pubPatch,
            skipLinkCheck: true,
            skipLinkCheckReason: docAction.detail,
          },
        });
        continue;
      }

      // When we skip, we only need to bump the audit stamp
      docMutationDescriptors.push(baseMutation);
      continue;
    }

    docsForAiReview.push({ doc, content: docAction.content });
  }

  // Fetch the taxonomy classification docs the LLM needs in context
  const taxonomyDocs = await getReferenceTaxonomies(env);
  // Process the documents we need to pass to the reviewer
  for (let i = 0; i < docsForAiReview.length; i++) {
    // Monitor elapsed time to ensure we don't breach Input Tokens p/m limit
    const startedAt = performance.now();

    const reviewInput = docsForAiReview[i];
    try {
      const aiReview = await getAiReview(
        env,
        reviewInput.doc,
        reviewInput.content,
        taxonomyDocs,
      );

      if (aiReview === null) {
        // todo - log ai review failure
        continue;
      }

      // create the draft from the AI review
      const draftDoc = getDraftDocumentFromAiReview(aiReview, reviewInput.doc);

      const baseMutation = getBaseMutationDescriptor(reviewInput.doc);

      if (!draftHasChanges(draftDoc, reviewInput.doc)) {
        logger.info("ai_content_review_ai_review_outcome", {
          docId: reviewInput.doc._id,
          status: "success",
          detail: "no changes",
        });
        docMutationDescriptors.push(baseMutation);
        continue;
      }

      logger.info("ai_content_review_ai_review_outcome", {
        docId: reviewInput.doc._id,
        status: "success",
        detail: "draft created",
      });
      docMutationDescriptors.push({ ...baseMutation, draft: draftDoc });
    } catch (error) {
      logger.error("ai_content_review_ai_review_outcome", {
        docId: reviewInput.doc._id,
        status: "fail",
        reason: error instanceof Error ? error.message : String(error),
      });
    }

    // Sleep between iterations if needed
    if (i < docsForAiReview.length - 1) {
      const elapsed = performance.now() - startedAt;
      const remaining = env.AI_REVIEW_MIN_GAP_MS - elapsed;

      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
    }
  }

  const sanityClient = getSanityClient(env);

  const settledCommits = await Promise.allSettled(
    docMutationDescriptors.map((mDescriptor) => {
      const tx = sanityClient
        .transaction()
        .patch(mDescriptor.pubId, (p) =>
          p.ifRevisionId(mDescriptor.pubRev).set(mDescriptor.pubPatch),
        );

      if (mDescriptor.draft) {
        tx.createIfNotExists(mDescriptor.draft);
      }

      return tx.commit({ visibility: "async" });
    }),
  );

  // Just logging
  for (let i = 0; i < settledCommits.length; i++) {
    const action = docMutationDescriptors[i];
    const result = settledCommits[i];
    if (result.status === "rejected") {
      logger.warn("ai_content_review_sanity_commit_outcome", {
        docId: action.pubId,
        status: "fail",
        reason:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      });
      continue;
    }
    logger.info("ai_content_review_sanity_commit_outcome", {
      docId: action.pubId,
      status: "success",
    });
  }
}

// export type FetchResult =
//   | { ok: true; content: string }
//   | { ok: false; reason: "http"; status: number }
//   | { ok: false; reason: "network" | "timeout" | "empty" };
