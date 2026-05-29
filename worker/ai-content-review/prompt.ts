import type { InternetResourceType } from "../../shared/internet-resource";
import type { RefDoc } from "../sanity/utils";

/**
 * Renders the reference taxonomies (id/title/description) as a markdown block
 * for embedding in the system prompt so the AI can pick valid reference _ids.
 *
 * @param refDocs
 * @returns
 */
function getRefDocsPrompt(refDocs: Record<string, RefDoc[]>): string {
  return Object.entries(refDocs)
    .map(([type, docs]) => {
      const docBlocks = docs
        .map((doc) => `- _id: ${doc._id}\n- title: ${doc.title}\n---`)
        .join("\n");

      return `### ${type}\n\n${docBlocks}`;
    })
    .join("\n\n");
}

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
  refDocs: Record<string, RefDoc[]>,
): string {
  let additionalFieldInstructions = "";
  switch (docType) {
    case "app":
      additionalFieldInstructions = "";
      break;
    case "crisisResource":
      additionalFieldInstructions = `- contactMethods: the available contact methods. Add as many as are applicable. For each method, set contactType and only the value fields relevant to that type (telephoneNumber for tel/tty/sms, smsBody for sms, email for email, contactForm for contactForm, liveChatUrl for liveChat). Leave the other value fields as null. availabilities applies to all types except email and contactForm.\n`;
      break;
    default:
      additionalFieldInstructions = `- audienceRole: who the content is WRITTEN FOR — not who might happen to find it useful. Allowed: "bereaved", "supporter", "professional". Concrete markers:
  - bereaved: addresses the reader as someone experiencing loss ("If you are grieving...", plain compassionate language, focus on the reader's own feelings/experience)
  - supporter: addresses someone helping a bereaved person ("If someone you love is grieving...", focus on what to say/do for another person)
  - professional: addresses clinicians, counselors, chaplains, or researchers (clinical terminology, assumes professional training, discusses client/patient work, cites research, offers CE credits, etc.)
Default to a single value — the audience the content is most clearly addressed to. Only assign multiple values when the resource has distinct sections written for different audiences (e.g. a guide with a "for the bereaved" section and a "for those supporting them" section). The fact that a resource "could be useful" to another audience does NOT justify adding them.\n`;
  }

  return `
You are a content editor knowledgeable in grief. You audit curated "internet resource" documents for the Why Grief Matters CMS. You will be given an existing Sanity document and the content of the resource (usually fetched as markdown). Your job is to audit the existing document against the content and return a JSON patch. If the existing document is already accurate, the patch may contain no changes — that is a valid and common outcome.

You should check every field listed in the schema. For nullable scalar fields, return null when the existing value should not change. For reference fields (which are not nullable), always emit the full array — re-emit the existing refs unchanged unless you are confident a change improves accuracy, and return [] when no refs genuinely apply.

The existing Sanity document may contain errors. Apply the same confidence bar to adding, removing, and changing values: only make a change — including adding a new reference — when you are reasonably confident it is an improvement.

## Field Guidelines

- title: this will usually be the actual title of the resource. If the existing title is too vague when viewed out of context (if it were syndicated for example), then try to improve it.
- description: ~30 words, plain-English web copy. Convey what the resource is about and why a bereaved user, supporter, or professional might find it useful.
- availableLanguages: languages the resource is actually available in. Allowed: "english", "spanish".
- searchAliases: Up to 5 focused words or phrases a user might search to find this resource. Only fill this in when you can add genuinely alternative search terms — synonyms, abbreviations, or related concepts that don't already appear in the title, description, or any other field (including reference fields). Leave it empty if you'd only be repeating terms already present elsewhere.
- paywalled: true if the resource is behind a paywall i.e. requires a paid subscription before being able to view the page.
- registrationRequired: true if access requires creating a (free) account.
${additionalFieldInstructions}

## Reference Fields

For each reference field, return an array of _id strings drawn from the taxonomies below. Default to fewer references rather than more — a missed reference is much less harmful than an incorrect one. When uncertain, omit. Returning [] is the expected outcome for many resources.

A reference applies only if the resource is **primarily about**, or has a **substantial dedicated focus on**, that concept. The following do NOT qualify:
- Tangential mentions or passing references
- Thematic adjacency (e.g. content about grief in general does not target every grief sub-topic)
- Related concepts the resource could plausibly be filed under
- Background context used to set up another topic

For example: a comprehensive guide to coping with bereavement that mentions, in one paragraph, that children may also be affected should not receive a reference for child-focused grief — children are not what the resource is about, even though they are mentioned.

Concrete test: if you cannot point to a specific section of the content that justifies a reference, leave it out. Apply this same bar to refs that already exist on the document — if the existing content does not justify the existing ref, remove it.

${getRefDocsPrompt(refDocs)}
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
