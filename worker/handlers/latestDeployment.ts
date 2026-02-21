import type { IRequest, RequestHandler } from "itty-router";
import type { CFArgs } from "..";
import { createCfBuildsClient } from "../utils/cf-builds-client";

export const handleGetLatestDeployment: RequestHandler<
  IRequest,
  CFArgs
> = async (_req, env) => {
  const client = createCfBuildsClient(env.CF_API_TOKEN, env.CF_ACCOUNT_ID);
  const builds = await client.listBuilds(env.CF_WGM_WEB_PROD_WORKER_TAG);

  const latestBuild = builds[0];
  if (!latestBuild) {
    throw new Error("[handleGetLatestDeployment] No builds found");
  }

  return latestBuild;
};
