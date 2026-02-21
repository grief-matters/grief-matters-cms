import type { IRequest, RequestHandler } from "itty-router";
import type { CFArgs } from "..";
import { createCfBuildsClient } from "../utils/cf-builds-client";

export const handleGetDeployment: RequestHandler<IRequest, CFArgs> = async (
  req,
  env
) => {
  const client = createCfBuildsClient(env.CF_API_TOKEN, env.CF_ACCOUNT_ID);
  return client.getBuild(req.params.deploymentId);
};
