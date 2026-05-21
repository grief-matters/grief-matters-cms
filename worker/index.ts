import { handleScheduled } from "./cron-handler";

export default {
  async scheduled(
    event: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    ctx.waitUntil(handleScheduled(event, env, ctx));
  },
} satisfies ExportedHandler<Env>;
