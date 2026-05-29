import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import z from "zod";
import type { SanityDocument } from "sanity";

import {
  isRefField,
  type InternetResourceType,
} from "../../shared/internet-resource";
import { days, timezones } from "../../shared/datetime";
import { contactTypes } from "../../shared/contact-type";

import { getClaudeClient } from "./llm-client";
import { type RefDoc } from "../sanity/utils";
import { logger } from "../utils/logger";
import { getSystemPrompt, getUserMessage } from "./prompt";

export type ReviewInput = { doc: SanityDocument; content: string };

export type AiReview =
  | AiReviewBase
  | AiReviewWithAudience
  | AiReviewWithContactMethods;

export type AiAvailability = z.infer<typeof zAiAvailability>;

type AiReviewResult = null | AiReview;
type AiReviewBase = z.infer<typeof zAiReviewBase>;
type AiReviewWithAudience = z.infer<typeof zAiReviewWithAudience>;
type AiReviewWithContactMethods = z.infer<typeof zAiReviewWithContactMethods>;

// Reference array fields are intentionally non-nullable: Anthropic structured
// outputs has a 16-parameter limit on union-typed fields. The AI always emits
// the desired final ref list (the existing doc is supplied in the user message),
// so re-emitting the current refs is a no-op write.
const zAiReviewBase = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  availableLanguages: z.array(z.enum(["english", "spanish"])).nullable(),
  searchAliases: z.array(z.string()).nullable(),
  paywalled: z.boolean().nullable(),
  registrationRequired: z.boolean().nullable(),
  lossRelationships: z.array(z.string()),
  causesOfDeath: z.array(z.string()),
  themes: z.array(z.string()),
  demographics: z.array(z.string()),
  griefPhases: z.array(z.string()),
  griefTypes: z.array(z.string()),
  contentFunctions: z.array(z.string()),
  emotionalStates: z.array(z.string()),
});

const zAiReviewWithAudience = z.object({
  ...zAiReviewBase.shape,
  audienceRole: z
    .array(z.enum(["bereaved", "supporter", "professional"]))
    .nullable(),
});

// These schemas are simplified vs the Sanity schemas to avoid 'compiled grammar too large' errors with Claude
const zAiAvailability = z.object({
  days: z.array(z.enum(days)),
  availableFrom: z.string(),
  availableTo: z.string(),
  timezone: z.enum(timezones),
});

const zAiContactMethod = z.object({
  contactType: z.enum(contactTypes),
  telephoneNumber: z.string().nullable(),
  smsBody: z.string().nullable(),
  email: z.string().nullable(),
  contactForm: z.string().nullable(),
  liveChatUrl: z.string().nullable(),
  availabilities: z.array(zAiAvailability).nullable(),
});
export type AiContactMethod = z.infer<typeof zAiContactMethod>;

const zAiReviewWithContactMethods = z.object({
  ...zAiReviewBase.shape,
  contactMethods: z.array(zAiContactMethod).nullable(),
});

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
  refDocs: Record<string, RefDoc[]>,
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

/**
 * Picks the Zod schema describing the AI's structured output for a given
 * resource type: crisis resources get contact methods, apps get the base
 * schema, everything else gets the audience-role variant.
 *
 * @param docType
 * @returns
 */
function getOutputSchemaForDocType(docType: InternetResourceType) {
  switch (docType) {
    case "crisisResource":
      return zAiReviewWithContactMethods;
    case "app":
      return zAiReviewBase;
    default:
      return zAiReviewWithAudience;
  }
}

/**
 * Sends the existing doc and fetched content to Claude and returns the parsed
 * structured-output review, or null if the model failed to produce a valid
 * response. The system prompt is marked for ephemeral caching since it's large
 * and identical across docs of the same type within a run.
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
  refDocs: Record<string, RefDoc[]>,
): Promise<AiReviewResult> {
  const client = getClaudeClient(env);
  const { _createdAt, _id, _rev, _updatedAt, ...restDoc } = doc;

  const response = await client.messages.parse({
    model: "claude-sonnet-4-6",
    max_tokens: env.AI_REVIEW_MAX_OUTPUT_TOKENS,
    thinking: { type: "adaptive" },
    output_config: {
      format: zodOutputFormat(
        getOutputSchemaForDocType(doc._type as InternetResourceType),
      ),
      effort: "medium",
    },
    system: [
      {
        type: "text",
        text: getSystemPrompt(doc._type as InternetResourceType, refDocs),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: getUserMessage(restDoc, content) }],
  });

  logger.info("getAiReview:token_usage", {
    docId: doc._id,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    cacheCreationTokens: response.usage.cache_creation_input_tokens,
    cacheReadTokens: response.usage.cache_read_input_tokens,
    contentChars: content.length,
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    logger.warn("getAiReview:fail", {
      docId: doc._id,
      stopReason: response.stop_reason,
    });
    return null;
  }

  const validParsed = getValidAiReview<AiReview>(parsed, refDocs);

  return validParsed;
}
