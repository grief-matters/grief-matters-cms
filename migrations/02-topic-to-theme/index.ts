import { at, defineMigration, MigrationContext, set } from "sanity/migrate";
import groq from "groq";
import { INTERNET_RESOURCE_TYPES } from "../../constants";
import {
  docTypeToFieldMap,
  TopicSlug,
  topicSlugMigrationMap,
} from "./topic-slug-map";

type CachedDoc = { slug: string; _id: string };
type Cache = {
  topics: CachedDoc[];
  griefPhases: CachedDoc[];
  griefTypes: CachedDoc[];
  themes: CachedDoc[];
  contentFunctions: CachedDoc[];
  emotionalStates: CachedDoc[];
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
      "topics": *[_type == 'topic']{"slug": slug.current, _id},
      "griefPhases": *[_type == 'griefPhase']{"slug": slug.current, _id},
      "griefTypes": *[_type == 'griefType']{"slug": slug.current, _id},
      "themes": *[_type == 'theme']{"slug": slug.current, _id},
      "contentFunctions": *[_type == 'contentFunction']{"slug": slug.current, _id},
      "emotionalStates": *[_type == 'emotionalState']{"slug": slug.current, _id},
    }
  `);
}

export default defineMigration({
  title: "Retag resources from topic to new schemas",
  documentTypes: [...INTERNET_RESOURCE_TYPES],
  migrate: {
    async document(doc, context) {
      const topics = doc.topics as Array<{ _ref: string }> | undefined;
      if (!topics || topics.length === 0) {
        return [];
      }

      if (!cache) {
        cache = await buildCache(context);
      }

      const newRefsByField: Record<string, RefArrayMember[]> = {};
      const seenByField: Record<string, Set<string>> = {};

      for (const topic of topics) {
        const cachedTopic = cache.topics.find((t) => t._id === topic._ref);
        if (!cachedTopic) {
          continue;
        }

        const migrationConfig =
          topicSlugMigrationMap[cachedTopic.slug as TopicSlug];
        if (!migrationConfig) {
          continue;
        }

        const fieldName = docTypeToFieldMap[migrationConfig.docType];
        const targetDoc = cache[fieldName as keyof Cache].find(
          (d) => d.slug === migrationConfig.slug
        );
        if (!targetDoc) {
          console.warn(
            `[topic-to-theme] no ${migrationConfig.docType} doc found with slug "${migrationConfig.slug}" (mapped from topic "${cachedTopic.slug}")`
          );
          continue;
        }

        if (!newRefsByField[fieldName]) {
          newRefsByField[fieldName] = [];
          seenByField[fieldName] = new Set();
        }
        if (seenByField[fieldName].has(targetDoc._id)) {
          continue;
        }
        seenByField[fieldName].add(targetDoc._id);

        newRefsByField[fieldName].push({
          _key: targetDoc._id,
          _type: "reference",
          _ref: targetDoc._id,
        });
      }

      const mutations = [];
      for (const [fieldName, newRefs] of Object.entries(newRefsByField)) {
        const existing =
          (doc[fieldName] as Array<RefArrayMember> | undefined) ?? [];
        const existingIds = new Set(existing.map((r) => r._ref));
        const merged = [
          ...existing,
          ...newRefs.filter((r) => !existingIds.has(r._ref)),
        ];
        mutations.push(at(fieldName, set(merged)));
      }

      return mutations;
    },
  },
});
