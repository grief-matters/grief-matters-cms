import type { IRequest, RequestHandler } from "itty-router";
import type { CFArgs } from "..";
import { getCloudflareClient } from "../utils/cf-client";

export const handleGetLatestDeployment: RequestHandler<
  IRequest,
  CFArgs
> = async (_req, env) => {
  const client = getCloudflareClient(env);
  if (client === null) {
    throw new Error(
      "[handleGetLatestDeployment] Could not get Cloudflare client"
    );
  }

  const deployments = await client.pages.projects.deployments.list(
    env.CF_WEB_PROJECT_NAME,
    { account_id: env.CF_ACCOUNT_ID }
  );

  const latestDeployment = deployments.result?.[0];
  if (typeof latestDeployment === "undefined") {
    throw new Error("[handleGetLatestDeployment] No latest deployment found");
  }

  return latestDeployment;
};
