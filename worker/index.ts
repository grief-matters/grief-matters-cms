import { AutoRouter, type IRequest } from "itty-router";

import { logger } from "./utils/logger";
import { runAiContentReview } from "./ai-content-review";

export type CFArgs = [Env, ExecutionContext];

async function handleAiContentReview(env: Env, limit: number) {
  logger.info("handleAiContentReview", "started");

  try {
    await runAiContentReview(env, limit);
  } catch (error) {
    // Swallow so Cloudflare doesn't retry the scheduled trigger
    logger.error(
      "handleAiContentReview",
      error instanceof Error ? error.message : String(error),
    );
  }

  logger.info("handleAiContentReview", "ended");
}

async function handleFallback(req: IRequest, env: Env) {
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
}

async function handleScheduled(
  event: ScheduledController,
  env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  switch (event.cron) {
    case "0 */6 * * *":
      await handleAiContentReview(env, 2);
      break;
    default:
      logger.warn("unhandled_cron", event.cron);
  }
}

const router = AutoRouter<IRequest, CFArgs>();
router.all("*", handleFallback);

export default {
  fetch: router.fetch,
  scheduled: handleScheduled,
};
