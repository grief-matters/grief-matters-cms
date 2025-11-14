import type { IRequest, RequestHandler } from "itty-router";
import type { CFArgs } from "..";

export const handleWebsiteDeploy: RequestHandler<IRequest, CFArgs> = async (
  _req,
  env
) => {
  // TODO - needs reimplementing following Pages migration to Workers
  throw new Error("[handleWebsiteDeploy] Not implemented");
};

export const handleGetDeployments: RequestHandler<IRequest, CFArgs> = async (
  _req,
  env
) => {
  // TODO - needs reimplementing following Pages migration to Workers
  throw new Error("[handleGetDeployments] Not implemented");
};
