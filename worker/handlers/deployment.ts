import { IRequest, RequestHandler } from "itty-router";
import { CFArgs } from "..";

export const handleGetDeployment: RequestHandler<IRequest, CFArgs> = async (
  req,
  env
) => {
  // TODO - needs reimplementing following Pages migration to Workers
  throw new Error("[handleGetDeployment] Not implemented");
};
