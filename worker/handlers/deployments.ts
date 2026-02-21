import type { IRequest, RequestHandler } from "itty-router";
import type { CFArgs } from "..";
import { createCfBuildsClient } from "../utils/cf-builds-client";

export const handleWebsiteDeploy: RequestHandler<IRequest, CFArgs> = async (
  _req,
  env
) => {
  const client = createCfBuildsClient(env.CF_API_TOKEN, env.CF_ACCOUNT_ID);
  return client.triggerBuild(env.CF_WGM_WEB_PROD_WORKER_TRIGGER_UUID);
};

export const handleGetDeployments: RequestHandler<IRequest, CFArgs> = async (
  _req,
  env
) => {
  const client = createCfBuildsClient(env.CF_API_TOKEN, env.CF_ACCOUNT_ID);
  return client.listBuilds(env.CF_WGM_WEB_PROD_WORKER_TAG);
};
