import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { SanityDocument } from "sanity";

import {
  type AiReviewResponse,
  getOutputSchemaForDocType,
  type RefDoc,
  type SanityInternetResourcePatch,
} from "../utils/sanity";
import { getClaudeClient } from "../utils/llm-client";
import type { InternetResourceType } from "../../types";

function getRefDocsPrompt(refDocs: Record<string, RefDoc[]>): string {
  return Object.entries(refDocs)
    .map(([type, docs]) => {
      const docBlocks = docs
        .map(
          (doc) =>
            `- _id: ${doc._id}\n- title: ${doc.title}\n- description: ${doc.description}\n---`,
        )
        .join("\n");
      return `### ${type}\n\n${docBlocks}`;
    })
    .join("\n\n");
}

function getSystemPrompt(
  docType: InternetResourceType,
  refDocs: Record<string, RefDoc[]>,
): string {
  let additionalFieldInstructions = "";
  switch (docType) {
    case "app":
      additionalFieldInstructions = "";
    case "crisisResource":
      additionalFieldInstructions = `- contactMethods: the available contact methods. Add as many as are applicable.\n`;
    default:
      additionalFieldInstructions = `- audienceRole: intended audience. Allowed: "bereaved", "supporter", "professional". Usually a single value; multiple only if the resource genuinely speaks to more than one audience.\n`;
  }

  return `
You are a content editor knowledgeable in grief. You audit curated "internet resource" documents for the Why Grief Matters CMS. You will be given an existing Sanity document and the content of the resource (usually fetched as markdown). It is your job to review the existing document against the content, and create a JSON patch describing any changes.
  
You should check every field listed in the schema. Return null for any field that should not change. Return [] for reference fields if the resource genuinely has no matching items.

The existing Sanity document may contain errors, so use your judgement to remove and change any existing values if you feel that they have been applied incorrectly but only do this when you are reasonably confident.

## Field Guidelines

- title: this will usually be the actual title of the resource. If the existing title is too vague when viewed out of context (if it were syndicated for example), then try to improve it.
- description: ~30 words, plain-English web copy. Convey what the resource is about and why a bereaved user, supporter, or professional might find it useful.
- availableLanguages: languages the resource is actually available in. Allowed: "english", "spanish".
- searchAliases: Up to 5 focused words or phrases a user might search to find this resource. Only fill this in when you can add genuinely alternative search terms — synonyms, abbreviations, or related concepts that don't already appear in the title, description, or any other field (including reference fields). Leave it empty if you'd only be repeating terms already present elsewhere.
- paywalled: true if the resource is behind a paywall i.e. requires a paid subscription before being able to view the page.
- registrationRequired: true if access requires creating a (free) account.
${additionalFieldInstructions}

## Reference Fields

For each reference field, return an array of _id strings drawn from the taxonomies below. Only include a reference if the resource specifically targets that concept — never as a catch-all. Returning [] means "no references apply"

${getRefDocsPrompt(refDocs)}
  `;
}

function getUserMessage(doc: Record<string, unknown>, content: string): string {
  return `
Existing document:
\`\`\`json
${JSON.stringify(doc, null, 2)}
\`\`\`

Resource content (markdown):
${content}

Review the document against the resource content and return the patch.
`;
}

type AiReview = {
  id: string;
  patch: SanityInternetResourcePatch | null;
};

function toPatch(response: AiReviewResponse): SanityInternetResourcePatch {
  const patch: SanityInternetResourcePatch = {};
  for (const [key, value] of Object.entries(response)) {
    if (value !== null) {
      (patch as Record<string, unknown>)[key] = value;
    }
  }
  return patch;
}

export async function getAiReview(
  env: Env,
  doc: SanityDocument,
  content: string,
  refDocs: Record<string, RefDoc[]>,
): Promise<AiReview> {
  const client = getClaudeClient(env);
  const { _createdAt, _id, _rev, _updatedAt, ...restDoc } = doc;

  const response = await client.messages.parse({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
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

  const parsed = response.parsed_output;
  if (!parsed) {
    return {
      id: doc._id,
      patch: null,
    };
  }

  return {
    id: doc._id,
    patch: toPatch(parsed),
  };
}
