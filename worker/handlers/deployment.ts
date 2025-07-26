import { IRequest, RequestHandler } from "itty-router";
import { CFArgs } from "..";
import { getCloudflareClient } from "../utils/cf-client";

export const handleGetDeployment: RequestHandler<IRequest, CFArgs> = async (
  req,
  env
) => {
  const client = getCloudflareClient(env);
  if (client === null) {
    throw new Error("[handleGetDeployment] Could not get Cloudflare client");
  }

  const { deploymentId } = req.params;
  if (typeof deploymentId === "undefined") {
    throw new Error("[handleGetDeployment] Invalid 'deploymentId' parameter");
  }
  const deployment = await client.pages.projects.deployments.get(
    env.CF_WEB_PROJECT_NAME,
    deploymentId,
    {
      account_id: env.CF_ACCOUNT_ID,
    }
  );

  return deployment;
};
