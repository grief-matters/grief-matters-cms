import { createClient, SanityClient } from "@sanity/client";
import groq from "groq";

import { INTERNET_RESOURCE_TYPES } from "../../constants";

export interface SanityDocumentUrlResult {
  _id: string;
  _type: string;
  title?: string;
  name?: string;
  resourceUrl?: string;
  appleUrl?: string;
  playStoreUrl?: string;
  spotifyUrl?: string;
}

let client: SanityClient | null = null;

export async function fetchResourcesForBrokenLinkReport(
  env: Env
): Promise<SanityDocumentUrlResult[]> {
  // Lazy create client
  if (client === null) {
    client = createClient({
      projectId: env.SANITY_STUDIO_PROJECT_ID,
      dataset: env.SANITY_STUDIO_DATASET,
      apiVersion: env.SANITY_STUDIO_API_VERSION,
      token: env.SANITY_API_AUTH_TOKEN,
      useCdn: false,
    });
  }

  const query = groq`*[_type in $types && !(_id in path("drafts.**")) && skipLinkCheck != true]{
    _id, _type, title, name, resourceUrl, appleUrl, playStoreUrl, spotifyUrl
  }`;

  return client.fetch<SanityDocumentUrlResult[]>(query, {
    types: [...INTERNET_RESOURCE_TYPES],
  });
}
