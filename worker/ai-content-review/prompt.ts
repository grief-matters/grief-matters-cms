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
    "~30 words, plain-English web copy. Convey what the resource is about and why a bereaved user, supporter, or professional might find it useful. When the resource centres on a specific relationship or cause of death, name it (e.g. ‘a father writes about his daughter’s suicide’). The description is how users decide whether a resource fits their loss.",
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
  supportedGriever: `- supportedGriever: describes attributes of the bereaved person being supported. Allowed: "child", "teen". Only applies when audienceRole includes "supporter" or "professional" — i.e. the content is addressed to someone helping a bereaved person. Apply a tag only when the content specifically addresses supporting a bereaved person of that age group (e.g. "helping a grieving child", "supporting a teen through loss"). Leave empty if audienceRole is only "bereaved", or if the supporter/professional content does not specifically focus on supporting a child or teen.`,
  lossRelationships:
    "Apply only when the resource is written for, or centred on, people bereaved in this relationship across most of its content. A dedicated passage inside a broader resource does not qualify.",
  causesOfDeath:
    "Apply only when the cause shapes the resource as a whole. Prefer the most specific cause; do not add Sudden Traumatic alongside a specific cause that already fits.",
  themes:
    "A subject matter or theme covered by a resource (e.g. anger, self-care, funerals & memorials). Most resources warrant 0–2 themes. Apply only when the theme is the subject of a dedicated section — a paragraph or more discussing it in its own right — not introduced as example, modifier, or one item among many.",
  griefPhases: `The stages individuals often experience after a significant loss, based on contemporary grief research — a custom list, not the Kübler-Ross 5 stages. Most resources warrant 0–1 phases. Apply only when a phase is the resource's organizing frame across multiple sections; a passing reference to early grief, adapting, or integrating.`,
  griefTypes:
    "Type of grief experience. Some overlap with phase and cause is fine — types describe a kind of experience rather than a moment in time or a cause. Apply a tag only when the resource explicitly names the type or substantively addresses it across the content.",
  contentFunctions:
    "The primary job(s) the resource does — what the reader is trying to accomplish when this resource serves them well. Validation and Educational are NOT additive by default. Pick the one that names the primary job (Educational when the resource explains; Validation when it normalizes), and add the second only when the resource has substantive passages devoted to each.",
  emotionalStates:
    "Most resources warrant 0 emotional states. Apply only when the resource is structured around the state — a section devoted to it, repeated discussion, or the state named in headings. A passing mention of guilt, anger, etc. as one feeling among others does not qualify.",
  demographics:
    "A demographic describes a specific identity or community of people. Most resources warrant 0 demographics. Apply only when a resource is explicitly targeted at a demographic (named in title/positioning, dedicated programming, or framing throughout), not merely when members of that demographic might find it useful.",
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

## Existing values vs empty fields

**Existing values:** Treat existing values as a previous editor’s judgement, but not as exempt from review. Every reference tag in your output, existing or new, must pass the inclusion test below. Remove an existing tag when no passage in the content supports it. Keep an existing tag without a supporting passage only when the fetched content is clearly incomplete (truncated, mostly navigation, or failed to load the main body). For nullable scalars, return null to mean “no change”.

**Empty reference fields:** Empty is NOT a default-to-fill signal. Each field has its own base rate, given in the field guidelines below — for most optional taxonomies, empty is the most common correct state. Add a tag only when it passes the inclusion test below.

Over-tagging is a worse failure mode than under-tagging for every reference field. It is most damaging for lossRelationships and causesOfDeath, because users combine these as filters and a single wrong tag puts a resource in front of someone it wasn't written for.

## Reference Fields — inclusion test

For each reference field, return an array of _id strings drawn from the taxonomies below. For each candidate tag, both gates must pass:

1. **Quote gate.** Identify the single strongest continuous passage in the content where the candidate concept appears.
2. Resource-level gate. If you removed every passage about this concept, would the resource’s purpose or main audience change? A concept that is the subject of one paragraph inside a resource about something else fails this gate.
3. Reader gate (lossRelationships and causesOfDeath only). Would a reader who lost this person, or lost someone in this way, recognise the resource as being about their loss? Content that discusses the loss as context, history, or one case among many does not pass.

Both yes → include. Either no → leave it out.

When the resource enumerates discrete sub-items — "we offer groups for stillbirth, miscarriage, neonatal loss, pregnancy termination" — every item that maps to a taxonomy term should be included. Under-tagging an explicit enumeration is a clear miss, not caution.

A reference does NOT apply if the resource only:
- mentions the concept in passing
- is thematically adjacent
- could plausibly be filed under it
- uses it as background context
- uses it as one example illustrating a different point
- the concept appears only in an author bio, byline, ‘about us’ section or founding story. Tag what the resource is about, not who wrote or founded it.

## Field Guidelines

${allFieldKeys.map((fKey) => `${fKey}: ${fieldGuidelines[fKey as AiReviewFieldKey]}`).join(`\n`)}\n

## Common over-tagging mistakes

- A resource that mentions anniversary reactions on birthdays and holidays once, as an example of a broader point (e.g. how absences feel sharper at life milestones), does NOT earn \`theme:Holidays and Significant Dates\`. The theme requires holidays/dates to be the subject of a dedicated section.
- A resource that notes loss can "trigger guilt over unresolved issues" in a single sentence does NOT earn \`emotionalState:Guilt and Regret\`. Emotional state tags require the state to be the organizing focus of a section.
- A resource that says "grow through rather than get over" once does NOT earn \`griefPhase:Integrating\` unless integration is the resource's frame across multiple sections.
- A Educationalal resource that includes a few "this is natural" or "you're not alone" beats does NOT additionally earn \`contentFunction:Validation\`. Validation requires substantive passages devoted to normalizing the reader's experience.
- An essay about loved ones killed by violence that never centres on a particular relationship does NOT earn a lossRelationship tag, even if one of the examples is a son or daughter.

## Reference Field Documents by Field

${Object.entries(refDocs)
  .filter(([txKey, _]) => refKeys.includes(txKey))
  .map(([txKey, docs]) => {
    const docBlocks = docs
      .map(
        (doc) =>
          `- _id: ${doc._id}\n- title: ${doc.title}\n- tagging guidance: ${doc.aiPromptHint ?? ""}\n---`,
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
