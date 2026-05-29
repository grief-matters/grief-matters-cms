import type { SanityDocument } from "sanity";

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
  type RefDoc,
  type SanityMutationDescriptor,
} from "../sanity/utils";
import { logger } from "../utils/logger";
import { type ReviewInput, getAiReview } from "./ai-review";
import {
  type DocumentContentResult,
  getDocumentContent,
  getDocumentActionFromContentResult,
} from "./content";

type ClassifiedContent = {
  mutations: SanityMutationDescriptor[];
  toReview: ReviewInput[];
};

type ContentItem = { doc: SanityDocument; content: DocumentContentResult };

function classifyContentResults(items: ContentItem[]): ClassifiedContent {
  const mutations: SanityMutationDescriptor[] = [];
  const toReview: ReviewInput[] = [];

  for (const { doc, content } of items) {
    const docAction = getDocumentActionFromContentResult(content);

    if (docAction.action === "review") {
      toReview.push({ doc, content: docAction.content });
      continue;
    }

    const baseMutation = getBaseMutationDescriptor(doc);

    if (docAction.action === "disable") {
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
    mutations.push(baseMutation);
  }

  return { mutations, toReview };
}

/**
 *
 * @param env
 * @param inputs
 * @param taxonomyDocs
 * @returns
 */
async function runAiReviews(
  env: Env,
  inputs: ReviewInput[],
  taxonomyDocs: Record<string, RefDoc[]>,
): Promise<SanityMutationDescriptor[]> {
  const mutations: SanityMutationDescriptor[] = [];

  for (let i = 0; i < inputs.length; i++) {
    // Monitor elapsed time to ensure we don't breach Input Tokens p/m limit
    const startedAt = performance.now();
    const reviewInput = inputs[i];

    try {
      const aiReview = await getAiReview(
        env,
        reviewInput.doc,
        reviewInput.content,
        taxonomyDocs,
      );

      if (aiReview === null) {
        continue;
      }

      const draftDoc = getDraftDocumentFromAiReview(aiReview, reviewInput.doc);
      const baseMutation = getBaseMutationDescriptor(reviewInput.doc);

      if (!draftHasChanges(draftDoc, reviewInput.doc)) {
        logger.info("runAiReviews", `'${reviewInput.doc._id}' has no changes`);
        mutations.push(baseMutation);
        continue;
      }

      logger.info("runAiReviews", `'${reviewInput.doc._id}' has new draft`);
      mutations.push({ ...baseMutation, draft: draftDoc });
    } catch (error) {
      logger.error(
        "runAiReviews",
        `failed review for '${reviewInput.doc._id}': ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (i < inputs.length - 1) {
      const elapsed = performance.now() - startedAt;
      const remaining = env.AI_REVIEW_MIN_GAP_MS - elapsed;
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
    }
  }

  return mutations;
}

/**
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
 *
 * @param env
 * @param limit
 * @returns
 */
export async function runAiContentReview(env: Env, limit: number) {
  const resourceDocs = await getOldestPublishedDocsByTypes(
    env,
    [...internetResourceTypes],
    limit,
  );

  if (resourceDocs.length === 0) {
    logger.info(
      "runAiContentReview",
      "'getOldestPublishedDocsByTypes' returned no docs",
    );
    return;
  }

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

      continue;
    }
    fulfilledContent.push({ doc, content: result.value });
  }

  const { mutations, toReview } = classifyContentResults(fulfilledContent);

  const taxonomyDocs = await getReferenceTaxonomies(env);
  const reviewMutations = await runAiReviews(env, toReview, taxonomyDocs);

  await commitMutations(env, [...mutations, ...reviewMutations]);
}
