import {
  createIfNotExists,
  defineMigration,
  type MigrationContext,
} from "sanity/migrate";
import type { SanityDocument } from "sanity";
import groq from "groq";

const DRAFT_PREFIX = "drafts.";

// Fields with a direct counterpart on `externalOrg`. Anything else on `website`
// (e.g. `directlyQuoted`, `hasSpanishVersion`, `audiences`) is either dropped or
// handled by special-case logic below. `availableLanguages` lives outside the
// schema but is set by migration 05 and is worth carrying across.
const COPYABLE_FIELDS = [
  "title",
  "description",
  "resourceUrl",
  "logo",
  "audienceRole",
  "topics",
  "lossRelationships",
  "causesOfDeath",
  "availableLanguages",
] as const;

type CachedDoc = { _id: string; slug: string };
type Cache = { audiences: CachedDoc[]; demographics: CachedDoc[] };

let cache: Cache | null = null;

const buildCache = async (context: MigrationContext): Promise<Cache> =>
  context.client.fetch<Cache>(groq`
    {
      "audiences": *[_type == "audience"]{_id, "slug": slug.current},
      "demographics": *[_type == "demographic"]{_id, "slug": slug.current},
    }
  `);

type RefArrayMember = { _key: string; _type: "reference"; _ref: string };

const mapAudiencesToDemographics = (
  audiences: Array<{ _ref: string }>,
  c: Cache
): RefArrayMember[] => {
  const seen = new Set<string>();
  const out: RefArrayMember[] = [];

  for (const audience of audiences) {
    const cachedAudience = c.audiences.find((a) => a._id === audience._ref);
    if (!cachedAudience) {
      continue;
    }

    // expected for slugs without a counterpart, e.g. "supporters"
    const demographic = c.demographics.find(
      (d) => d.slug === cachedAudience.slug
    );
    if (!demographic) {
      continue;
    }

    if (seen.has(demographic._id)) {
      continue;
    }
    seen.add(demographic._id);

    out.push({
      _key: demographic._id,
      _type: "reference",
      _ref: demographic._id,
    });
  }

  return out;
};

const newIdFor = (oldId: string): string => {
  const isDraft = oldId.startsWith(DRAFT_PREFIX);
  const baseId = isDraft ? oldId.slice(DRAFT_PREFIX.length) : oldId;
  const newBaseId = `externalOrg-from-website-${baseId}`;
  return isDraft ? `${DRAFT_PREFIX}${newBaseId}` : newBaseId;
};

export default defineMigration({
  title: "Copy `website` documents to new `externalOrg` documents",
  documentTypes: ["website"],

  migrate: {
    async document(doc, context) {
      const next: Record<string, unknown> = {
        _id: newIdFor(doc._id),
        _type: "externalOrg",
      };

      for (const key of COPYABLE_FIELDS) {
        const value = (doc as Record<string, unknown>)[key];
        if (value !== undefined) {
          next[key] = value;
        }
      }

      const sourceAudiences = doc.audiences as
        | Array<{ _ref: string }>
        | undefined;
      const existingDemographics =
        (doc.demographics as RefArrayMember[] | undefined) ?? [];

      if (sourceAudiences && sourceAudiences.length > 0) {
        if (!cache) {
          cache = await buildCache(context);
        }
        const mapped = mapAudiencesToDemographics(sourceAudiences, cache);
        const seen = new Set(existingDemographics.map((r) => r._ref));
        const merged = [
          ...existingDemographics,
          ...mapped.filter((r) => !seen.has(r._ref)),
        ];
        if (merged.length > 0) {
          next.demographics = merged;
        }
      } else if (existingDemographics.length > 0) {
        next.demographics = existingDemographics;
      }

      return createIfNotExists(next as unknown as SanityDocument);
    },
  },
});
