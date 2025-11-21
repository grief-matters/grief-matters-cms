import { IRequest, RequestHandler } from "itty-router";
import { CFArgs } from "..";

export const handleFallback: RequestHandler<IRequest, CFArgs> = async (
  req,
  env
) => {
  let response = await env.ASSETS.fetch(req);

  if (response.status === 404) {
    // If we can't find the asset then rewrite the response to hand back to Sanity
    response = await env.ASSETS.fetch(new URL("/index.html", req.url));
  }

  return response;
};
