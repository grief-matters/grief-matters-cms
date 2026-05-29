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
        .map(
          (doc) =>
            `- _id: ${doc._id}\n- title: ${doc.title}\n- description: ${doc.description}\n---`,
        )
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
      additionalFieldInstructions = `- audienceRole: intended audience. Allowed: "bereaved", "supporter", "professional". Usually a single value; multiple only if the resource genuinely speaks to more than one audience.\n`;
  }

  return `
You are a content editor knowledgeable in grief. You audit curated "internet resource" documents for the Why Grief Matters CMS. You will be given an existing Sanity document and the content of the resource (usually fetched as markdown). It is your job to review the existing document against the content, and create a JSON patch describing any changes.
  
You should check every field listed in the schema. For nullable scalar fields, return null when the existing value should not change. For reference fields (which are not nullable), always return the full array of _ids you believe should apply — re-emit the existing refs if they are already correct, modify them if not, and return [] if no refs apply.

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

For each reference field, return an array of _id strings drawn from the taxonomies below. Only include a reference if the resource specifically targets that concept — never as a catch-all. Return [] if no references apply.

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
