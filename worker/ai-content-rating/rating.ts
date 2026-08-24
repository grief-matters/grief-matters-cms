import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type {
  Model,
  OutputConfig,
  ThinkingConfigParam,
} from "@anthropic-ai/sdk/resources";
import type { SanityDocument } from "sanity";

import type { ScorableResourceType } from "../../shared/internet-resource";
import { getClaudeClient } from "../ai-content-review/llm-client";
import { logger } from "../utils/logger";
import { getRatingSystemPrompt, getRatingUserMessage } from "./prompt";
import { zQualityRating, type QualityRating } from "./schema";

export type QualityRatingUsage = {
  input: number;
  output: number;
  cacheCreation: number;
  cacheRead: number;
};

export type QualityRatingResult = {
  rating: QualityRating | null;
  usage: QualityRatingUsage | undefined;
  failureReason?: string;
};

const model: Model = "claude-opus-4-7";
const maxTokens = 3000;
const thinking: ThinkingConfigParam = { type: "adaptive" };
const effort: OutputConfig["effort"] = "medium";

/**
 * Sends the existing doc and fetched content to Claude and returns the parsed
 * quality rating (a 1-10 score or -1 for N/A, plus a rationale) along with token
 * usage, or `rating: null` plus a `failureReason` if the model failed to produce
 * a valid response. The system prompt is marked for ephemeral caching since it's
 * large and identical across docs of the same type within a run.
 *
 * @param env
 * @param doc
 * @param content
 * @returns
 */
export async function getQualityScore(
  env: Env,
  doc: SanityDocument,
  content: string,
): Promise<QualityRatingResult> {
  const client = getClaudeClient(env);
  const { _createdAt, _id, _rev, _updatedAt, ...restDoc } = doc;

  const systemPrompt = getRatingSystemPrompt(doc._type as ScorableResourceType);

  const response = await client.messages.parse({
    model,
    max_tokens: maxTokens,
    thinking,
    output_config: {
      format: zodOutputFormat(zQualityRating),
      effort,
    },
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      { role: "user", content: getRatingUserMessage(restDoc, content) },
    ],
  });

  const usage: QualityRatingUsage = {
    input: response.usage.input_tokens,
    output: response.usage.output_tokens,
    cacheCreation: response.usage.cache_creation_input_tokens ?? 0,
    cacheRead: response.usage.cache_read_input_tokens ?? 0,
  };

  logger.info("getQualityScore:token_usage", {
    docId: doc._id,
    inputTokens: usage.input,
    outputTokens: usage.output,
    cacheCreationTokens: usage.cacheCreation,
    cacheReadTokens: usage.cacheRead,
    contentChars: content.length,
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    logger.warn("getQualityScore:fail", {
      docId: doc._id,
      stopReason: response.stop_reason,
    });

    return {
      rating: null,
      usage,
      failureReason: `parse_failed: ${response.stop_reason}`,
    };
  }

  return { rating: parsed as QualityRating, usage };
}
