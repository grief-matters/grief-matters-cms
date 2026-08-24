import type { SanityDocument } from "sanity";

import { isScorableResourceType } from "../../shared/internet-resource";
import {
  getQualityScore,
  type QualityRatingResult,
} from "../ai-content-rating/rating";
import { QUALITY_SCORE_NA } from "../ai-content-rating/schema";
import { getReferenceTaxonomies, getSanityClient } from "../sanity/client";
import {
  countChangedFields,
  getBaseMutationDescriptor,
  getDraftDocumentFromAiReview,
  type RefDoc,
  type SanityMutationDescriptor,
} from "../sanity/utils";
import { logger } from "../utils/logger";
import {
  type AiReviewResult,
  type ReviewInput,
  getAiReview,
} from "./ai-review";
import {
  type DocumentContentResult,
  getDocumentContent,
  getDocumentActionFromContentResult,
} from "./content";
import { ReviewReportSink, type ScoreOutcome } from "./report-sink";

type ClassifiedContent = {
  mutations: SanityMutationDescriptor[];
  toReview: ReviewInput[];
};

type ContentItem = { doc: SanityDocument; content: DocumentContentResult };

function classifyContentResults(
  items: ContentItem[],
  sink: ReviewReportSink,
): ClassifiedContent {
  const mutations: SanityMutationDescriptor[] = [];
  const toReview: ReviewInput[] = [];

  for (const { doc, content } of items) {
    const stamp = sink.stampFor(doc._id);
    const docAction = getDocumentActionFromContentResult(content);

    if (docAction.action === "review") {
      toReview.push({ doc, content: docAction.content });
      continue;
    }

    const baseMutation = getBaseMutationDescriptor(doc, stamp);

    if (docAction.action === "disable") {
      sink.record({
        auditEventId: stamp,
        _id: doc._id,
        docType: doc._type,
        outcome: "disabled",
        success: false,
        fieldCount: null,
        failureReason: docAction.detail,
      });
      mutations.push({
        ...baseMutation,
        pubPatch: {
          ...baseMutation.pubPatch,
          skipLinkCheck: true,
          skipLinkCheckReason: docAction.detail,
        },
      });
      continue;
    }

    // Skip: only bump the audit stamp
    sink.record({
      auditEventId: stamp,
      _id: doc._id,
      docType: doc._type,
      outcome: "skipped",
      success: false,
      fieldCount: null,
    });
    mutations.push(baseMutation);
  }

  return { mutations, toReview };
}

/**
 * Calls `getAiReview` and folds thrown errors into the same `AiReviewResult`
 * shape as parse failures, so the caller doesn't have to branch on try/catch.
 */
async function safeGetAiReview(
  env: Env,
  reviewInput: ReviewInput,
  taxonomyDocs: Record<string, RefDoc[]>,
): Promise<AiReviewResult> {
  try {
    return await getAiReview(
      env,
      reviewInput.doc,
      reviewInput.content,
      taxonomyDocs,
    );
  } catch (error) {
    const failureReason =
      error instanceof Error ? error.message : String(error);
    logger.error(
      "safeGetAiReview",
      `failed review for '${reviewInput.doc._id}': ${failureReason}`,
    );
    return { review: null, usage: undefined, failureReason };
  }
}

/**
 * Calls `getQualityScore` and folds thrown errors into the same
 * `QualityRatingResult` shape as parse failures, so the caller doesn't have to
 * branch on try/catch.
 */
async function safeGetQualityScore(
  env: Env,
  doc: SanityDocument,
  content: string,
): Promise<QualityRatingResult> {
  try {
    return await getQualityScore(env, doc, content);
  } catch (error) {
    const failureReason =
      error instanceof Error ? error.message : String(error);
    logger.error(
      "safeGetQualityScore",
      `failed rating for '${doc._id}': ${failureReason}`,
    );
    return { rating: null, usage: undefined, failureReason };
  }
}

type ScoreBranchResult = {
  scoreOutcome: ScoreOutcome;
  qualityScore?: number;
  scoreTokens?: QualityRatingResult["usage"];
};

/**
 * The quality-scoring "branch" of a review. Fires only for scorable resource
 * types that don't yet have a `qualityScore` (score-once). On success it injects
 * the score and rationale into `draftDoc` (mutated in place, before the change
 * count is taken, so a score-only draft still registers as a change). Scoring
 * failure is soft: the draft is left scoreless and the review still commits — a
 * human backfills the score when they approve the draft.
 *
 * @param env
 * @param doc
 * @param content
 * @param draftDoc
 * @returns
 */
async function scoreIfNeeded(
  env: Env,
  doc: SanityDocument,
  content: string,
  draftDoc: SanityDocument,
): Promise<ScoreBranchResult> {
  if (!isScorableResourceType(doc._type)) {
    return { scoreOutcome: "not_scorable" };
  }
  // Any existing value (including -1 / N/A) counts as scored — never re-score.
  if (doc.qualityScore != null) {
    return { scoreOutcome: "already_scored" };
  }

  const result = await safeGetQualityScore(env, doc, content);
  if (result.rating === null) {
    logger.warn(
      "reviewDoc",
      `scoring failed for '${doc._id}', committing draft without a score: ${result.failureReason}`,
    );
    return { scoreOutcome: "score_failed", scoreTokens: result.usage };
  }

  const { qualityScore, rationale } = result.rating;
  const draft = draftDoc as Record<string, unknown>;
  draft.qualityScore = qualityScore;
  draft.qualityScoreNotes = rationale;

  return {
    scoreOutcome: qualityScore === QUALITY_SCORE_NA ? "score_na" : "scored",
    qualityScore,
    scoreTokens: result.usage,
  };
}

/**
 * Reviews a single doc end-to-end: invokes the AI, records a report line, and
 * returns the mutation to commit (or null if the review failed). Happy path is
 * top-level — failure short-circuits with an early return.
 */
async function reviewDoc(
  env: Env,
  reviewInput: ReviewInput,
  taxonomyDocs: Record<string, RefDoc[]>,
  sink: ReviewReportSink,
): Promise<SanityMutationDescriptor | null> {
  const doc = reviewInput.doc;
  const stamp = sink.stampFor(doc._id);
  const startedAt = performance.now();
  const result = await safeGetAiReview(env, reviewInput, taxonomyDocs);
  const lineBase = {
    auditEventId: stamp,
    _id: doc._id,
    docType: doc._type,
    tokens: result.usage,
  };

  if (result.review === null) {
    sink.record({
      ...lineBase,
      outcome: "ai_failed",
      success: false,
      fieldCount: null,
      latencyMs: Math.round(performance.now() - startedAt),
      failureReason: result.failureReason,
    });
    return null;
  }

  const draftDoc = getDraftDocumentFromAiReview(result.review, doc);
  // Branch off to scoring (may add a second AI call) before counting changes,
  // so an injected score registers as a change and produces a score-only draft.
  const scoreBranch = await scoreIfNeeded(
    env,
    doc,
    reviewInput.content,
    draftDoc,
  );
  const baseMutation = getBaseMutationDescriptor(doc, stamp);
  const fieldCount = countChangedFields(draftDoc, doc);

  sink.record({
    ...lineBase,
    outcome: "ai_success",
    success: true,
    fieldCount,
    latencyMs: Math.round(performance.now() - startedAt),
    scoreOutcome: scoreBranch.scoreOutcome,
    qualityScore: scoreBranch.qualityScore,
    scoreTokens: scoreBranch.scoreTokens,
  });

  const hasChanges = fieldCount > 0;
  logger.info(
    "reviewDoc",
    `'${doc._id}' ${hasChanges ? "has new draft" : "has no changes"}`,
  );
  return hasChanges ? { ...baseMutation, draft: draftDoc } : baseMutation;
}

/**
 * Waits long enough that the next AI call starts at least `gapMs` after the
 * current one. No-op on the last iteration.
 */
async function throttleBetweenReviews(
  index: number,
  total: number,
  startedAt: number,
  gapMs: number,
): Promise<void> {
  if (index >= total - 1) {
    return;
  }
  const remaining = gapMs - (performance.now() - startedAt);
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
}

/**
 * Runs each AI review sequentially, queuing one mutation per successful
 * review (a draft when the AI's output differs from the existing doc, base-only
 * when it doesn't). Sleeps between calls to keep us under the Anthropic
 * input-tokens per minute rate limit. Failures are recorded to the sink and
 * skipped — no mutation queued.
 */
async function runAiReviews(
  env: Env,
  reviewInputs: ReviewInput[],
  taxonomyDocs: Record<string, RefDoc[]>,
  sink: ReviewReportSink,
): Promise<SanityMutationDescriptor[]> {
  const mutations: SanityMutationDescriptor[] = [];

  for (let i = 0; i < reviewInputs.length; i++) {
    const startedAt = performance.now();
    const reviewInput = reviewInputs[i];

    const mutation = await reviewDoc(env, reviewInput, taxonomyDocs, sink);
    if (mutation) {
      mutations.push(mutation);
    }

    await throttleBetweenReviews(
      i,
      reviewInputs.length,
      startedAt,
      env.AI_REVIEW_MIN_GAP_MS,
    );
  }

  return mutations;
}

/**
 * Commits all mutations to Sanity in parallel as independent transactions. Each
 * transaction patches the published doc (guarded by `ifRevisionId` to detect
 * concurrent edits) and creates the draft if one was produced. Uses async
 * visibility — we don't wait for the change to appear in queries.
 *
 * @param env
 * @param mutations
 */
async function commitMutations(
  env: Env,
  mutations: SanityMutationDescriptor[],
): Promise<void> {
  const sanityClient = getSanityClient(env);

  const settledCommits = await Promise.allSettled(
    mutations.map((m) => {
      const tx = sanityClient
        .transaction()
        .patch(m.pubId, (p) => p.ifRevisionId(m.pubRev).set(m.pubPatch));

      if (m.draft) {
        tx.createIfNotExists(m.draft);
      }

      return tx.commit({ visibility: "async" });
    }),
  );

  // This block is just logging
  for (let i = 0; i < settledCommits.length; i++) {
    const m = mutations[i];
    const result = settledCommits[i];

    if (result.status === "rejected") {
      logger.warn(
        "commitMutations",
        `'client.transaction.commit' promise rejected for '${m.pubId}': ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`,
      );
      continue;
    }
    logger.info(
      "commitMutations",
      `successfully committed mutation for '${m.pubId}': ${m.draft ? "draft" : "no changes"}`,
    );
  }
}

/**
 * Entry point for a review pass: takes a pre-fetched batch of resource docs,
 * pulls their content, classifies each as skip/disable/review, runs AI reviews
 * on the eligible ones, and commits all resulting mutations in one batch. Docs
 * reached by skip/disable/review-success paths get a mutation (at minimum a
 * stamp-only patch that also clears `flaggedForAiReview`), which bumps
 * `_updatedAt` and rotates them to the back of the oldest-first queue. Failure
 * paths (content-fetch and AI-review) deliberately produce no mutation, so
 * those docs stay near the head and get retried next cycle — transient
 * failures self-heal, persistent ones surface as recurring entries in the
 * per-cycle report written to the `AI_REVIEW_REPORTS` KV namespace, prompting
 * a human to set `skipLinkCheck` or fix the doc.
 *
 * @param env
 * @param resourceDocs
 * @returns
 */
export async function runAiContentReview(
  env: Env,
  resourceDocs: SanityDocument[],
) {
  if (resourceDocs.length === 0) {
    logger.info("runAiContentReview", "no docs to review");
    return;
  }

  const sink = new ReviewReportSink();

  const contentResults = await Promise.allSettled(
    resourceDocs.map((doc) => getDocumentContent(env, doc)),
  );

  const fulfilledContent: ContentItem[] = [];
  for (let i = 0; i < contentResults.length; i++) {
    const result = contentResults[i];
    const doc = resourceDocs[i];

    if (result.status !== "fulfilled") {
      logger.warn(
        "runAiContentReview",
        `'getDocumentContent' promise rejected for '${doc._id}': ${result.reason}`,
      );
      sink.record({
        auditEventId: sink.stampFor(doc._id),
        _id: doc._id,
        docType: doc._type,
        outcome: "content_fetch_failed",
        success: false,
        fieldCount: null,
        failureReason:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      });
      continue;
    }
    fulfilledContent.push({ doc, content: result.value });
  }

  const { mutations, toReview } = classifyContentResults(
    fulfilledContent,
    sink,
  );

  const taxonomyDocs = await getReferenceTaxonomies(env);
  const reviewMutations = await runAiReviews(env, toReview, taxonomyDocs, sink);

  // Make sure sink.flush always runs
  try {
    await commitMutations(env, [...mutations, ...reviewMutations]);
  } finally {
    await sink.flush(env.AI_REVIEW_REPORTS);
  }
}
