import { runAiContentReview } from "./ai-content-editor/runAiContentReview";

export async function handleScheduled(
  event: ScheduledController,
  env: Env,
  ctx: ExecutionContext
): Promise<void> {
  switch (event.cron) {
    case "0 0 * * *":
      await runAiContentReview(env, ctx);
      break;
    default:
      console.warn(`Unhandled cron: ${event.cron}`);
  }
}
