import {
  type InternetResourceType,
  type TaxonomyRefField,
} from "../../shared/internet-resource";
import type { RefDoc } from "../sanity/utils";
import { getOutputSchemaForDocType, type AiReviewFieldKey } from "./schema";

const fieldGuidelines: Record<AiReviewFieldKey, string> = {
  title:
    "this will usually be the actual title of the resource. If the existing title is too vague when viewed out of context (if it were syndicated for example), then try to improve it.",
  description:
    "~30 words, plain-English web copy. Convey what the resource is about and why a bereaved user, supporter, or professional might find it useful.",
  availableLanguages: `- availableLanguages: detect languages from any of:
  - a language toggle/switcher in site navigation (e.g. "En Español")
  - sections of the page rendered in that language
  - group/program names in that language ("Encuentros de apoyo")
  - an explicit statement that materials are available in that language
  A generic "Translate this page" widget (e.g. Google Translate) does NOT count. Always include English unless the resource is explicitly not in English.`,
  searchAliases:
    "Up to 5 focused words or phrases a user might search to find this resource. Only fill this in when you can add genuinely alternative search terms — synonyms, abbreviations, or related concepts that don't already appear in the title, description, or any other field (including reference fields). Leave it empty if you'd only be repeating terms already present in other fields.",
  registrationRequired:
    "true if access requires creating an account on the site OR a third-party platform (Sharewell, Zoom registration walls, Facebook private group approval), OR submitting an intake form/interview. Browsing-only access without an account → false.",
  paywalled:
    "true if accessing the substantive content requires a paid subscription. A suggested donation that is explicitly waivable is NOT paywalled.",
  contactMethods:
    "the available contact methods. Add as many as are applicable. For each method, set contactType and only the value fields relevant to that type (telephoneNumber for tel/tty/sms, smsBody for sms, email for email, contactForm for contactForm, liveChatUrl for liveChat). Leave the other value fields as null. availabilities applies to all types except email and contactForm.",
  audienceRole: `- audienceRole: who the content is WRITTEN FOR — not who might happen to find it useful. Allowed: "bereaved", "supporter", "professional". Concrete markers:
  - bereaved: addresses the reader as someone experiencing loss ("If you are grieving...", plain compassionate language, focus on the reader's own feelings/experience)
  - supporter: addresses someone helping a bereaved person ("If someone you love is grieving...", focus on what to say/do for another person)
  - professional: addresses clinicians, counselors, chaplains, or researchers (clinical terminology, assumes professional training, discusses client/patient work, cites research, offers CE credits, etc.)
Default to a single value — the audience the content is most clearly addressed to. Only assign multiple values when the resource has distinct sections written for different audiences (e.g. a guide with a "for the bereaved" section and a "for those supporting them" section). The fact that a resource "could be useful" to another audience does NOT justify adding them`,
  lossRelationships:
    "The relationship to the person, being, or aspect of self that has been lost (e.g. parent, spouse, pet). Apply a tag only when the content specifically addresses that relationship; do not apply when it is only mentioned in passing or used as one example among many.",
  causesOfDeath:
    "The cause of a death that has been experienced (e.g. suicide, cancer, sudden / traumatic). Apply a tag only when the content specifically addresses bereavement shaped by that cause; do not apply to passing mentions or to deaths where a more specific cause fits.",
  themes:
    "A subject matter or theme covered by a resource (e.g. anger, self-care, funerals & memorials). Apply a tag only when the content meaningfully addresses that theme; do not apply when it appears only as background or example.",
  griefPhases: `the stages that individuals often experience after a significant loss based on contemporary grief research. This is a custom list, not just the common "5 stages of grief" found in the Kübler-Ross model. A resource can be tagged with the phase it most addresses.`,
  griefTypes:
    "Some of these overlap with phase and cause; that's fine. They describe a type of experience rather than a moment in time or a cause.",
  contentFunctions:
    "Captures the primary job the resource is doing — what the reader is trying to accomplish when this resource serves them well. A resource can have multiple functions, but each must be a primary job, not a side benefit.",
  emotionalStates:
    "A resource can address multiple states. Optional on most resources; populate ONLY when the content genuinely focuses on a state.",
  demographics:
    "A demographic describes a specific identity or community of people. Only add when a resource is targeted specifically at a demographic.",
} as const;

/**
 * Builds the reviewer system prompt, swapping in doc-type-specific field
 * instructions (audience role for most resources, contact methods for crisis
 * resources, none for apps). The output is large and stable across a run, so
 * the caller should mark it for prompt caching.
 *
 * @param docType
 * @param refDocs
 * @returns
 */
export function getSystemPrompt(
  docType: InternetResourceType,
  refDocs: Record<TaxonomyRefField, RefDoc[]>,
): string {
  const allFieldKeys = Object.keys(getOutputSchemaForDocType(docType).shape);

  const refKeys = Object.keys(refDocs).filter((rdKey) =>
    allFieldKeys.includes(rdKey),
  );

  return `
You are a content editor knowledgeable in grief. You audit curated "internet resource" documents for the Why Grief Matters CMS. You will be given an existing Sanity document and the content of the resource (usually fetched as markdown). Return the document's corrected state.

For each field, there are TWO distinct cases with DIFFERENT defaults:

**A. The field already has a value.** Treat the existing value as a previous editor's judgement. Keep it unless the fetched content gives you a specific, citable reason to change it — a sentence or section you can point to that contradicts the existing value. Return null for nullable scalars (meaning "no change") and re-emit existing reference arrays unchanged.

**B. The field is currently empty (null, missing, or []).** Treat empty as an UNFILLED BLANK, not as a deliberate "this doesn't apply." When the content clearly supports a value, FILL the field. The evidence bar is the same (a citable section).

Symmetrically: under-tagging a clearly applicable concept is just as much an error as over-tagging an inapplicable one.

## Reference Fields

For each reference field, return an array of _id strings drawn from the taxonomies below. The test for each candidate reference is the same in both directions: can you point to a specific section of the content that justifies it? If yes → include it. If no → leave it out.

When the resource enumerates discrete sub-items — "we offer groups for stillbirth, miscarriage, neonatal loss, infant loss" — every item that maps to a taxonomy term should be included. Under-tagging an explicit enumeration is a clear miss, not caution.

A reference does NOT apply if the resource only:
- mentions the concept in passing
- is thematically adjacent
- could plausibly be filed under it
- uses it as background context

## Field Guidelines

${allFieldKeys.map((fKey) => `${fKey}: ${fieldGuidelines[fKey as AiReviewFieldKey]}`).join(`\n`)}\n

## Reference Field Documents by Field

${Object.entries(refDocs)
  .filter(([txKey, _]) => refKeys.includes(txKey))
  .map(([txKey, docs]) => {
    const docBlocks = docs
      .map(
        (doc) =>
          `- _id: ${doc._id}\n- title: ${doc.title}\n- description: ${doc.aiPromptHint ?? ""}\n---`,
      )
      .join("\n");

    return `### ${txKey}\n\n${docBlocks}`;
  })
  .join("\n\n")}
  `;
}

/**
 * Builds the per-document user message containing the existing doc as JSON and
 * the fetched resource content as markdown. This is the only part of the
 * Anthropic request that varies per resource.
 *
 * @param doc
 * @param content
 * @returns
 */
export function getUserMessage(
  doc: Record<string, unknown>,
  content: string,
): string {
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
