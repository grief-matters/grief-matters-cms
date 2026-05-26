import type { SanityDocument } from "sanity";
import { INTERNET_RESOURCE_TYPES } from "../../constants";
import {
  getAuditableDocsByTypes,
  getReferenceTaxonomies,
  getSanityClient,
  getSanityDocFromReviewAction,
  type SanityInternetResourcePatch,
} from "../utils/sanity";
import { getAuditActionForDoc } from "../ai-content-editor";
import { getAiReview } from "../ai-content-editor/ai-review";
import { logMessage } from "../utils/logger";

export async function handleAiContentReview(env: Env) {
  logMessage("ai_content_review_start", "starting");

  const taxonomyDocs = await getReferenceTaxonomies(env);
  const resourceDocs = await getAuditableDocsByTypes(
    env,
    [...INTERNET_RESOURCE_TYPES],
    3,
  );
  console.log(resourceDocs);

  const docPatches: Record<string, SanityInternetResourcePatch> = {};
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

    if (auditAction.action !== "review") {
      // todo: think through conditions for actually skipping
      // docPatches[auditAction.id] = { skipLinkCheck: true };
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

    // todo: apparently Sanity is smart enough to no-op a mutation like this so we're gonna need a new field
    if (reviewAction.patch === null) {
      if (
        typeof doc.doc.title !== "string" ||
        doc.doc.title.trim().length === 0
      ) {
        // Log: we'll need to log this odd failure case out - it should never happen as documents should always have titles
        continue;
      }

      docPatches[reviewAction.id] = { title: doc.doc.title };
      continue;
    }

    const newDoc = getSanityDocFromReviewAction(doc.doc, reviewAction.patch);
    docCreates.push(newDoc);
  }

  const sanityClient = getSanityClient(env);
  // Do all the Sanity work
  const transaction = sanityClient.transaction();

  Object.entries(docPatches).forEach(([docId, patch]) =>
    transaction.patch(docId, (p) => p.set(patch)),
  );

  // todo - we're failing silently if a draft already exists - is this correct?
  docCreates.forEach((doc) => {
    return transaction.createIfNotExists(doc);
  });

  // todo - also handle failures
  const results = await transaction.commit({ visibility: "async" });
  // Log: do something with results once we understand its shape
  logMessage("ai_content_review_ai_sanity_transaction_result", results);
}
