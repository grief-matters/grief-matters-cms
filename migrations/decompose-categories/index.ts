import groq from "groq";
import { createIfNotExists, defineMigration, Mutation } from "sanity/migrate";

import { CATEGORY_CLASSIFICATION } from "./categoryMap";

type CategoryInfo = {
  slug: string;
  title: string;
};

// Cache across calls to `document()` so we don't refetch the same category
// for every resource that references it.
const categoryCache = new Map<string, CategoryInfo | null>();
const warnedUnmapped = new Set<string>();

const loadCategories = async (
  client: {
    fetch: <T>(q: string, params: Record<string, unknown>) => Promise<T>;
  },
  ids: string[]
): Promise<Map<string, CategoryInfo>> => {
  const missing = ids.filter((id) => !categoryCache.has(id));

  if (missing.length > 0) {
    const docs = await client.fetch<
      Array<{ _id: string; title?: string; slug?: string }>
    >(
      groq`*[_type == "category" && _id in $ids]{
        _id,
        title,
        "slug": slug.current
      }`,
      { ids: missing }
    );

    for (const id of missing) {
      const doc = docs.find((d) => d._id === id);
      if (!doc || !doc.slug || !doc.title) {
        categoryCache.set(id, null);
      } else {
        categoryCache.set(id, { slug: doc.slug, title: doc.title });
      }
    }
  }

  const result = new Map<string, CategoryInfo>();
  for (const id of ids) {
    const info = categoryCache.get(id);
    if (info) {
      result.set(id, info);
    }
  }
  return result;
};

export default defineMigration({
  title:
    "Decompose 'category' refs on resources into lossRelationship / causeOfDeath / topic docs",
  filter: `defined(categories) && count(categories) > 0`,

  migrate: {
    async document(doc, context) {
      const categories = doc.categories as Array<{ _ref: string }> | undefined;
      if (!Array.isArray(categories) || categories.length === 0) {
        return [];
      }

      const refIds = Array.from(new Set(categories.map((c) => c._ref)));
      const infoById = await loadCategories(context.client, refIds);

      const mutations: Mutation[] = [];
      const seenTargetIds = new Set<string>();

      for (const refId of refIds) {
        const info = infoById.get(refId);
        if (!info) {
          continue;
        }

        if (!(info.slug in CATEGORY_CLASSIFICATION)) {
          if (!warnedUnmapped.has(info.slug)) {
            warnedUnmapped.add(info.slug);
            console.warn(
              `[decompose-categories] unmapped category slug: "${info.slug}" — add it to CATEGORY_CLASSIFICATION`
            );
          }
          continue;
        }

        const target = CATEGORY_CLASSIFICATION[info.slug];
        if (!target) {
          continue;
        }

        const newId = `${target}-${info.slug}`;
        if (seenTargetIds.has(newId)) {
          continue;
        }
        seenTargetIds.add(newId);

        mutations.push(
          createIfNotExists({
            _id: newId,
            _type: target,
            title: info.title,
            slug: { _type: "slug", current: info.slug },
          })
        );
      }

      return mutations;
    },
  },
});
