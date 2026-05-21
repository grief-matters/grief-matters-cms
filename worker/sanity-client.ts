import { createClient, type SanityClient } from "@sanity/client";

let client: SanityClient | null = null;

export function getSanityClient(env: Env): SanityClient {
  if (client === null) {
    client = createClient({
      projectId: env.SANITY_STUDIO_PROJECT_ID,
      dataset: env.SANITY_STUDIO_DATASET,
      apiVersion: env.SANITY_STUDIO_API_VERSION,
      token: env.SANITY_API_AUTH_TOKEN,
      useCdn: false,
      perspective: "published",
    });
  }

  return client;
}
