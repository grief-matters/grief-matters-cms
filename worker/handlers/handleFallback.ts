import { IRequest, RequestHandler } from "itty-router";
import { CFArgs } from "..";

export const handleFallback: RequestHandler<IRequest, CFArgs> = async (
  req,
  env
) => {
  const url = new URL(req.url);

  // --- 2. STATIC ASSETS ---
  // Typical Sanity Studio output directories:
  if (
    url.pathname.startsWith("/static/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico")
  ) {
    return env.ASSETS.fetch(req);
  }

  // --- 3. SPA FALLBACK (Sanity Studio shell) ---
  // Only apply to GET navigation requests
  if (req.method === "GET") {
    return env.ASSETS.fetch(new URL("/index.html", req.url));
  }

  return new Response("Not found", { status: 404 });
};
