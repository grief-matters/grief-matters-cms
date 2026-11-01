import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getClaudeClient(env: Env): Anthropic {
  if (client === null) {
    // SDK retries 429/5xx with backoff (honouring retry-after); default is 2
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 4 });
  }

  return client;
}
