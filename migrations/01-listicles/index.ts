import { createIfNotExists, defineMigration } from "sanity/migrate";
import type { SanityDocument } from "sanity";

import candidatesJson from "../../listicle-candidates.json";
import { targetDocs } from "./target-docs";

const DRAFT_PREFIX = "drafts.";

// Fields defined on the base internet-resource schema factory
// (`createBaseInternetResourceSchema`) — carried 1:1 onto the new listicle doc.
const COPYABLE_FIELDS = [
  "title",
  "description",
  "resourceUrl",
  "sourceOrg",
  "imageRef",
  "availableLanguages",
  "skipLinkCheck",
  "paywalled",
  "registrationRequired",
  "lossRelationships",
  "causesOfDeath",
  "themes",
  "demographics",
  "audienceRole",
  "griefPhases",
  "griefTypes",
  "contentFunctions",
  "emotionalStates",
  "searchAliases",
] as const;

const targetIds = new Set<string>(targetDocs);

const listOfById = new Map<string, string>(
  candidatesJson.candidates.map((c) => [c._id, c.listOf[0]])
);

const newIdFor = (oldId: string): string => {
  const isDraft = oldId.startsWith(DRAFT_PREFIX);
  const baseId = isDraft ? oldId.slice(DRAFT_PREFIX.length) : oldId;
  const newBaseId = `listicle-from-article-${baseId}`;
  return isDraft ? `${DRAFT_PREFIX}${newBaseId}` : newBaseId;
};

export default defineMigration({
  title: "Convert selected article documents into listicle documents",
  documentTypes: ["article"],

  migrate: {
    document(doc) {
      const baseId = doc._id.startsWith(DRAFT_PREFIX)
        ? doc._id.slice(DRAFT_PREFIX.length)
        : doc._id;

      if (!targetIds.has(baseId)) {
        return [];
      }

      const listOf = listOfById.get(baseId);
      if (!listOf) {
        console.warn(`[01-listicles] no listOf value for ${baseId}`);
        return [];
      }

      const next: Record<string, unknown> = {
        _id: newIdFor(doc._id),
        _type: "listicle",
        listOf,
      };

      for (const key of COPYABLE_FIELDS) {
        const value = (doc as Record<string, unknown>)[key];
        if (value !== undefined) {
          next[key] = value;
        }
      }

      return createIfNotExists(next as unknown as SanityDocument);
    },
  },
});
