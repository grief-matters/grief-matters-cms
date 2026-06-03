import z from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { SanityDocument } from "sanity";

import {
  isRefField,
  type InternetResourceType,
  type TaxonomyRefField,
} from "../../shared/internet-resource";

import { getClaudeClient } from "./llm-client";
import { type RefDoc } from "../sanity/utils";
import { logger } from "../utils/logger";
import { getSystemPrompt, getUserMessage } from "./prompt";
import type {
  Model,
  OutputConfig,
  ThinkingConfigParam,
} from "@anthropic-ai/sdk/resources";
import {
  getOutputSchemaForDocType,
  zDefaultReview,
  type AiReview,
} from "./schema";

export type ReviewInput = { doc: SanityDocument; content: string };

/**
 * Filters reference _ids returned by the AI against the known taxonomies,
 * dropping any hallucinated ids. Logs whatever it drops so we can spot patterns.
 *
 * @param aiReview
 * @param refDocs
 * @returns
 */
function getValidAiReview<T extends AiReview>(
  aiReview: T,
  refDocs: Record<TaxonomyRefField, RefDoc[]>,
): T {
  const result: Record<string, unknown> = { ...aiReview };

  for (const [key, value] of Object.entries(aiReview)) {
    if (!isRefField(key) || !Array.isArray(value)) {
      continue;
    }

    const validIds = new Set((refDocs[key] ?? []).map((d) => d._id));
    const filtered = (value as string[]).filter((id) => validIds.has(id));

    if (filtered.length !== value.length) {
      logger.warn("getValidAiReview:dropped_refs", {
        field: key,
        dropped: (value as string[]).filter((id) => !validIds.has(id)),
      });
    }

    result[key] = filtered;
  }

  return result as T;
}

type MessageConfig = {
  model: Model;
  maxTokens: number;
  thinking: ThinkingConfigParam;
  outputSchema: z.ZodObject;
  effort: OutputConfig["effort"];
};

const messageConfigDefaults: MessageConfig = {
  thinking: { type: "adaptive" },
  model: "claude-sonnet-4-6",
  maxTokens: 4000,
  outputSchema: zDefaultReview,
  effort: "medium",
};

function getMessageConfig(docType: InternetResourceType): MessageConfig {
  const configDefaults = messageConfigDefaults;

  switch (docType) {
    case "app":
      return {
        ...configDefaults,
        outputSchema: getOutputSchemaForDocType(docType),
      };
    case "crisisResource":
      return {
        ...configDefaults,
        model: "claude-opus-4-7",
        outputSchema: getOutputSchemaForDocType(docType),
      };
    case "essentialService":
      return {
        ...configDefaults,
        model: "claude-opus-4-7",
        outputSchema: getOutputSchemaForDocType(docType),
      };
    case "article":
    case "blog":
    case "book":
    case "community":
    case "course":
    case "externalOrg":
    case "forum":
    case "listicle":
    case "memorial":
    case "peerSupport":
    case "podcast":
    case "podcastEpisode":
    case "printedMaterial":
    case "story":
    case "supportGroup":
    case "therapyResource":
    case "video":
    case "webinar":
      return configDefaults;
  }
}

export type AiReviewUsage = {
  input: number;
  output: number;
  cacheCreation: number;
  cacheRead: number;
};

export type AiReviewResult = {
  review: AiReview | null;
  usage: AiReviewUsage | undefined;
  failureReason?: string;
};

/**
 * Sends the existing doc and fetched content to Claude and returns the parsed
 * structured-output review along with token usage, or `review: null` plus a
 * `failureReason` if the model failed to produce a valid response. The system
 * prompt is marked for ephemeral caching since it's large and identical across
 * docs of the same type within a run.
 *
 * @param env
 * @param doc
 * @param content
 * @param refDocs
 * @returns
 */
export async function getAiReview(
  env: Env,
  doc: SanityDocument,
  content: string,
  refDocs: Record<TaxonomyRefField, RefDoc[]>,
): Promise<AiReviewResult> {
  const client = getClaudeClient(env);
  const { _createdAt, _id, _rev, _updatedAt, ...restDoc } = doc;

  const messageConfig = getMessageConfig(doc._type as InternetResourceType);
  const systemPrompt = getSystemPrompt(
    doc._type as InternetResourceType,
    refDocs,
  );

  const response = await client.messages.parse({
    model: messageConfig.model,
    max_tokens: messageConfig.maxTokens,
    thinking: messageConfig.thinking,
    output_config: {
      format: zodOutputFormat(messageConfig.outputSchema),
      effort: messageConfig.effort,
    },
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: getUserMessage(restDoc, content) }],
  });

  const usage: AiReviewUsage = {
    input: response.usage.input_tokens,
    output: response.usage.output_tokens,
    cacheCreation: response.usage.cache_creation_input_tokens ?? 0,
    cacheRead: response.usage.cache_read_input_tokens ?? 0,
  };

  logger.info("getAiReview:token_usage", {
    docId: doc._id,
    inputTokens: usage.input,
    outputTokens: usage.output,
    cacheCreationTokens: usage.cacheCreation,
    cacheReadTokens: usage.cacheRead,
    contentChars: content.length,
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    logger.warn("getAiReview:fail", {
      docId: doc._id,
      stopReason: response.stop_reason,
    });

    return {
      review: null,
      usage,
      failureReason: `parse_failed: ${response.stop_reason}`,
    };
  }

  const validParsed = getValidAiReview<AiReview>(parsed as AiReview, refDocs);

  return { review: validParsed, usage };
}
