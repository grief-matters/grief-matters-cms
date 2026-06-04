import { AutoRouter, type IRequest } from "itty-router";

import { internetResourceTypes } from "../shared/internet-resource";
import { runAiContentReview } from "./ai-content-review";
import {
  getOldestFlaggedPublishedDocsByTypes,
  getOldestPublishedDocsByTypes,
} from "./sanity/client";
import { logger } from "./utils/logger";

export type CFArgs = [Env, ExecutionContext];

async function handleAiContentReview(env: Env, limit: number) {
  logger.info("handleAiContentReview", "started");

  try {
    const docs = await getOldestPublishedDocsByTypes(
      env,
      [...internetResourceTypes],
      limit,
    );
    await runAiContentReview(env, docs);
  } catch (error) {
    // Swallow so Cloudflare doesn't retry the scheduled trigger
    logger.error(
      "handleAiContentReview",
      error instanceof Error ? error.message : String(error),
    );
  }

  logger.info("handleAiContentReview", "ended");
}

async function handleFlaggedAiContentReview(env: Env, limit: number) {
  logger.info("handleFlaggedAiContentReview", "started");

  try {
    const docs = await getOldestFlaggedPublishedDocsByTypes(
      env,
      [...internetResourceTypes],
      limit,
    );
    await runAiContentReview(env, docs);
  } catch (error) {
    // Swallow so Cloudflare doesn't retry the scheduled trigger
    logger.error(
      "handleFlaggedAiContentReview",
      error instanceof Error ? error.message : String(error),
    );
  }

  logger.info("handleFlaggedAiContentReview", "ended");
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
      await handleAiContentReview(env, env.AI_CONTENT_REVIEW_DOC_LIMIT);
      break;
    case "0 1-5,7-11,13-17,19-23 * * *":
      await handleFlaggedAiContentReview(env, env.AI_FLAGGED_REVIEW_DOC_LIMIT);
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
