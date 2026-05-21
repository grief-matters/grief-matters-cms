import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { SanityDocument } from "@sanity/client";
import { z } from "zod";
import { toSanityReferences } from "./patches";
import type { DocType, RefDoc, RefDocs } from "./types";

const AUDIT_MODEL = "claude-sonnet-4-6";
const AUDIT_MAX_TOKENS = 4000;

const zPatchSchema = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  availableLanguages: z.array(z.enum(["english", "spanish"])).nullable(),
  audienceRole: z
    .array(z.enum(["bereaved", "supporter", "professional"]))
    .nullable(),
  searchAliases: z.array(z.string()).nullable(),
  paywalled: z.boolean().nullable(),
  registrationRequired: z.boolean().nullable(),
  lossRelationships: z.array(z.string()).nullable(),
  causesOfDeath: z.array(z.string()).nullable(),
  themes: z.array(z.string()).nullable(),
  demographics: z.array(z.string()).nullable(),
  griefPhases: z.array(z.string()).nullable(),
  griefTypes: z.array(z.string()).nullable(),
  contentFunctions: z.array(z.string()).nullable(),
  emotionalStates: z.array(z.string()).nullable(),
});

export type Patch = Partial<{
  [K in keyof z.infer<typeof zPatchSchema>]: NonNullable<
    z.infer<typeof zPatchSchema>[K]
  >;
}>;

const REF_FIELDS = new Set([
  "lossRelationships",
  "causesOfDeath",
  "themes",
  "demographics",
  "griefPhases",
  "griefTypes",
  "contentFunctions",
  "emotionalStates",
]);

export function applyAuditPatch(
  doc: SanityDocument,
  patch: Patch
): SanityDocument {
  const result: Record<string, unknown> = { ...doc };
  for (const [key, value] of Object.entries(patch)) {
    if (REF_FIELDS.has(key) && Array.isArray(value)) {
      result[key] = toSanityReferences(value as string[]);
    } else {
      result[key] = value;
    }
  }
  return result as SanityDocument;
}

function serializeRefSection(
  fieldName: string,
  typeName: DocType,
  guidance: string,
  docs: RefDoc[]
): string {
  const entries = docs
    .map(
      (d) =>
        `- _id: ${d._id} | title: ${JSON.stringify(
          d.title
        )} | description: ${JSON.stringify(d.description ?? "")}`
    )
    .join("\n");
  return `### ${fieldName} (${typeName} — ${guidance})\n${entries}`;
}

function buildSystemPrompt(refDocs: RefDocs): string {
  return `You audit curated internet-resource documents for the Why Grief Matters CMS. You will be given an existing Sanity document and the current content of the resource (fetched as markdown). Produce a JSON patch describing any field changes.

For every field in the patch schema, return either the new value (if the document should be updated) or null (if the existing value is already correct). If nothing should change, return null for every field.

## Field guidelines

- title: the resource's actual page title, unless that title is too vague within our CMS (e.g. "Resources"). Leave more specific existing titles in place.
- description: ~30 words, plain-English web copy. Convey what the resource is about and why a bereaved user, supporter, or professional might find it useful.
- availableLanguages: languages the resource is actually available in. Allowed: "english", "spanish".
- audienceRole: intended audience. Allowed: "bereaved", "supporter", "professional". Usually a single value; multiple only if the resource genuinely speaks to more than one audience.
- searchAliases: up to 5 focused words/phrases a user might search that are NOT already covered by title, description, or reference fields. Used for search index enrichment. Avoid repetition with other fields.
- paywalled: true if the resource is behind a paywall.
- registrationRequired: true if access requires creating a (free) account.

## Reference fields

For each reference field, return an array of _id strings drawn from the taxonomies below. Only include a reference if the resource specifically targets that concept — never as a catch-all. Returning [] means "no references apply"; only do this when the existing value is clearly wrong.

${serializeRefSection(
  "lossRelationships",
  "lossRelationship",
  "the relationship to the person/being/aspect of self that has been lost",
  refDocs.lossRelationship
)}

${serializeRefSection(
  "causesOfDeath",
  "causeOfDeath",
  "the cause(s) of death the resource speaks to",
  refDocs.causeOfDeath
)}

${serializeRefSection(
  "themes",
  "theme",
  "specific topical themes the resource targets",
  refDocs.theme
)}

${serializeRefSection(
  "demographics",
  "demographic",
  "specific demographics the resource targets (the reader, not the subject)",
  refDocs.demographic
)}

${serializeRefSection(
  "griefPhases",
  "griefPhase",
  "phase(s) of grief the resource speaks to",
  refDocs.griefPhase
)}

${serializeRefSection(
  "griefTypes",
  "griefType",
  "type(s) of grief the resource speaks to",
  refDocs.griefType
)}

${serializeRefSection(
  "emotionalStates",
  "emotionalState",
  "emotional state(s) the resource speaks to",
  refDocs.emotionalState
)}

${serializeRefSection(
  "contentFunctions",
  "contentFunction",
  "function(s) the resource's content serves for the reader",
  refDocs.contentFunction
)}`;
}

function buildUserMessage(doc: SanityDocument, content: string): string {
  return `Existing document:
\`\`\`json
${JSON.stringify(doc, null, 2)}
\`\`\`

Resource content (markdown):
${content}

Audit the document against the resource content and return the patch.`;
}

export async function auditDocument(
  llm: Anthropic,
  doc: SanityDocument,
  content: string,
  refDocs: RefDocs
): Promise<Patch> {
  const response = await llm.messages.parse({
    model: AUDIT_MODEL,
    max_tokens: AUDIT_MAX_TOKENS,
    thinking: { type: "adaptive" },
    output_config: {
      format: zodOutputFormat(zPatchSchema),
      effort: "medium",
    },
    system: [
      {
        type: "text",
        text: buildSystemPrompt(refDocs),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: buildUserMessage(doc, content) }],
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(parsed).filter(([, v]) => v !== null && v !== undefined)
  ) as Patch;
}
