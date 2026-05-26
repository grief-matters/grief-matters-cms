import { AutoRouter, type IRequest } from "itty-router";

import { handleAiContentReview } from "./handlers/handleAiContentReview";
import { handleFallback } from "./handlers/handleFallback";

export type CFArgs = [Env, ExecutionContext];

const router = AutoRouter<IRequest, CFArgs>();

router.all("*", handleFallback);

async function handleScheduled(
  event: ScheduledController,
  env: Env,
  _ctx: ExecutionContext
): Promise<void> {
  switch (event.cron) {
    case "0 0 * * *":
      await handleAiContentReview(env);
      break;
    default:
      console.warn(`Unhandled cron: ${event.cron}`);
  }
}

export default {
  fetch: router.fetch,
  scheduled: handleScheduled,
};
