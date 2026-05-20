import { at, defineMigration, MigrationContext, set } from "sanity/migrate";
import groq from "groq";

const INTERNET_RESOURCE_DOCUMENT_TYPES = [
  "app",
  "article",
  "blog",
  "book",
  "community",
  "course",
  "crisisResource",
  "externalOrg",
  "forum",
  "listicle",
  "memorial",
  "peerSupport",
  "podcast",
  "podcastEpisode",
  "printedMaterial",
  "story",
  "supportGroup",
  "therapyResource",
  "video",
  "webinar",
  "website",
] as const;

type CachedDoc = { slug: string; _id: string };
type Cache = {
  audiences: CachedDoc[];
  demographics: CachedDoc[];
};

type RefArrayMember = {
  _key: string;
  _type: "reference";
  _ref: string;
};

let cache: Cache | null = null;

async function buildCache(context: MigrationContext): Promise<Cache> {
  return await context.client.fetch(groq`
    {
      "audiences": *[_type == 'audience']{"slug": slug.current, _id},
      "demographics": *[_type == 'demographic']{"slug": slug.current, _id},
    }
  `);
}

export default defineMigration({
  title: "Map 'audiences' refs to 'demographics' refs on internet resources",
  documentTypes: [...INTERNET_RESOURCE_DOCUMENT_TYPES],
  migrate: {
    async document(doc, context) {
      const audiences = doc.audiences as Array<{ _ref: string }> | undefined;
      if (!audiences || audiences.length === 0) {
        return [];
      }

      if (!cache) {
        cache = await buildCache(context);
      }

      const newRefs: RefArrayMember[] = [];
      const seen = new Set<string>();

      for (const audience of audiences) {
        const cachedAudience = cache.audiences.find(
          (a) => a._id === audience._ref
        );
        if (!cachedAudience) {
          continue;
        }

        const demographic = cache.demographics.find(
          (d) => d.slug === cachedAudience.slug
        );
        if (!demographic) {
          // expected for slugs without a counterpart, e.g. "supporters"
          continue;
        }

        if (seen.has(demographic._id)) {
          continue;
        }
        seen.add(demographic._id);

        newRefs.push({
          _key: demographic._id,
          _type: "reference",
          _ref: demographic._id,
        });
      }

      if (newRefs.length === 0) {
        return [];
      }

      const existing =
        (doc.demographics as Array<RefArrayMember> | undefined) ?? [];
      const existingIds = new Set(existing.map((r) => r._ref));
      const merged = [
        ...existing,
        ...newRefs.filter((r) => !existingIds.has(r._ref)),
      ];

      return [at("demographics", set(merged))];
    },
  },
});
