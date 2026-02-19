import { createClient } from "@sanity/client";

import { INTERNET_RESOURCE_TYPES } from "../../constants";

export interface SanityResourceDocument {
  _id: string;
  _type: string;
  title?: string;
  name?: string;
  resourceUrl?: string;
  appleUrl?: string;
  playStoreUrl?: string;
  spotifyUrl?: string;
}

const QUERY = `*[_type in $types && !(_id in path("drafts.**"))]{
  _id, _type, title, name, resourceUrl, appleUrl, playStoreUrl, spotifyUrl
}`;

export async function fetchPublishedResources(
  env: Env,
): Promise<SanityResourceDocument[]> {
  const client = createClient({
    projectId: env.SANITY_STUDIO_PROJECT_ID,
    dataset: env.SANITY_STUDIO_DATASET,
    apiVersion: "2024-01-01",
    token: env.SANITY_API_AUTH_TOKEN,
    useCdn: false,
  });

  return client.fetch<SanityResourceDocument[]>(QUERY, {
    types: [...INTERNET_RESOURCE_TYPES],
  });
}
