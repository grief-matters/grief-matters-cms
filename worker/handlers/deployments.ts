import type { IRequest, RequestHandler } from "itty-router";
import type { CFArgs } from "..";
import { getCloudflareClient } from "../utils/cf-client";

export const handleWebsiteDeploy: RequestHandler<IRequest, CFArgs> = async (
  _req,
  env
) => {
  const client = getCloudflareClient(env);
  if (client === null) {
    throw new Error(
      "[handleGetWebsiteDeployStatus] Could not get Cloudflare client"
    );
  }

  const deployment = await client.pages.projects.deployments.create(
    env.CF_WEB_PROJECT_NAME,
    {
      account_id: env.CF_ACCOUNT_ID,
    }
  );

  return deployment;
};

export const handleGetDeployments: RequestHandler<IRequest, CFArgs> = async (
  _req,
  env
) => {
  const client = getCloudflareClient(env);
  if (client === null) {
    throw new Error("[handleGetDeployments] Could not get Cloudflare client");
  }

  const deployments = await client.pages.projects.deployments.list(
    env.CF_WEB_PROJECT_NAME,
    { account_id: env.CF_ACCOUNT_ID }
  );

  return deployments;
};
