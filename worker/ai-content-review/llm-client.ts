import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getClaudeClient(env: Env): Anthropic {
  if (client === null) {
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }

  return client;
}
