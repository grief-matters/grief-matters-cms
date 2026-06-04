import { createClient } from "@sanity/client";
import type { SanityClient, SanityDocument } from "sanity";
import type { TaxonomyRefField } from "../../shared/internet-resource";
import type { RefDoc } from "./utils";
import groq from "groq";

let client: SanityClient | null = null;

export function getSanityClient(env: Env): SanityClient {
  if (client === null) {
    client = createClient({
      projectId: env.SANITY_STUDIO_PROJECT_ID,
      dataset: env.SANITY_STUDIO_DATASET,
      apiVersion: env.SANITY_STUDIO_API_VERSION,
      token: env.SANITY_API_AUTH_TOKEN,
      useCdn: false,
      perspective: "raw",
    });
  }

  return client;
}

export function getReferenceTaxonomies(
  env: Env,
): Promise<Record<TaxonomyRefField, RefDoc[]>> {
  const client = getSanityClient(env);

  return client.fetch(groq`{
    "lossRelationships": *[_type == 'lossRelationship']{_id, aiPromptHint, title, "description": shortDescription},
    "causesOfDeath": *[_type == 'causeOfDeath']{_id, aiPromptHint, title, "description": shortDescription},
    "themes": *[_type == 'theme']{_id, aiPromptHint, title, "description": shortDescription},
    "demographics": *[_type == 'demographic']{_id, aiPromptHint, "title": name, description},
    "griefPhases": *[_type == 'griefPhase']{_id, aiPromptHint, title, description},
    "griefTypes": *[_type == 'griefType']{_id, aiPromptHint, title, description},
    "emotionalStates": *[_type == 'emotionalState']{_id, aiPromptHint, title, description},
    "contentFunctions": *[_type == 'contentFunction']{_id, aiPromptHint, title, description},
  }`);
}

export async function getOldestPublishedDocsByTypes(
  env: Env,
  types: Array<string>,
  limit: number = 10,
): Promise<SanityDocument[]> {
  const client = getSanityClient(env);

  const docs = await client.fetch<SanityDocument[]>(
    groq`
      *[
        _type in $docTypes
        && defined(resourceUrl)
        && !(_id in path('drafts.**'))
        && !defined(*[_id == "drafts." + ^._id][0])
        && skipLinkCheck != true
      ] | order(_updatedAt asc)[0..$limit]
    `,
    {
      docTypes: types,
      // GROQ slices are inclusive on both ends: [0..N] returns N+1 items.
      limit: limit - 1,
    },
  );

  return docs;
}

export async function getOldestFlaggedPublishedDocsByTypes(
  env: Env,
  types: Array<string>,
  limit: number = 10,
): Promise<SanityDocument[]> {
  const client = getSanityClient(env);

  const docs = await client.fetch<SanityDocument[]>(
    groq`
      *[
        _type in $docTypes
        && defined(resourceUrl)
        && !(_id in path('drafts.**'))
        && !defined(*[_id == "drafts." + ^._id][0])
        && skipLinkCheck != true
        && flaggedForAiReview == true
      ] | order(_updatedAt asc)[0..$limit]
    `,
    {
      docTypes: types,
      limit: limit - 1,
    },
  );

  return docs;
}
