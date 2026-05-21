import groq from "groq";
import { SanityDocument } from "@sanity/client";
import { getSanityClient } from "../sanity-client";
import { getClaudeClient } from "../llm-client";
import { INTERNET_RESOURCE_TYPES } from "../../constants";
import { processDoc } from "./processDoc";
import { fetchReferenceTaxonomies } from "./references";

export async function runAiContentReview(env: Env, _ctx: ExecutionContext) {
  const sanity = getSanityClient(env);
  const llm = getClaudeClient(env);

  const refDocs = await fetchReferenceTaxonomies(sanity);

  const docs = await sanity.fetch<SanityDocument[]>(
    groq`*[_type in $docTypes && !(_id in path('drafts.**')) && skipLinkCheck != true] | order(_updatedAt asc)[0..$count]`,
    {
      docTypes: INTERNET_RESOURCE_TYPES,
      count: 9,
    }
  );

  console.log(JSON.stringify({ event: "batch_start", count: docs.length }));

  const settled = await Promise.allSettled(
    docs.map((doc) => processDoc({ env, llm, sanity, refDocs }, doc))
  );

  const tally: Record<string, number> = {};
  let errors = 0;

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    const docId = docs[i]._id;
    if (result.status === "fulfilled") {
      const outcome = result.value;
      tally[outcome.type] = (tally[outcome.type] ?? 0) + 1;
      console.log(
        JSON.stringify({ event: "doc_processed", docId, ...outcome })
      );
    } else {
      errors++;
      console.error(
        JSON.stringify({
          event: "doc_failed",
          docId,
          error: String(result.reason),
        })
      );
    }
  }

  console.log(
    JSON.stringify({
      event: "batch_complete",
      total: docs.length,
      errors,
      ...tally,
    })
  );
}
