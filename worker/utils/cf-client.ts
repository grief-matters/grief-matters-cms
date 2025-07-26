import Cloudflare from "cloudflare";

let client: Cloudflare | null = null;

export const getCloudflareClient = (env: Env) => {
  if (client === null) {
    client = new Cloudflare({
      apiToken: env.CF_API_PAGES_TOKEN,
    });
  }

  return client;
};
