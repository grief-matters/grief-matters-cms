import groq from "groq";
import { at, defineMigration, NodePatch, setIfMissing } from "sanity/migrate";

import { causeOfDeathSlugs } from "./causeOfDeathSlugs";

type CategorySource = {
  _id: string;
  slug?: string;
  featuredResources?: unknown;
  imageRef?: unknown;
  description?: unknown;
  shortDescription?: unknown;
};

type SanityFetcher = {
  fetch: <T>(q: string, params: Record<string, unknown>) => Promise<T>;
};

let categoryBySlug: Map<string, CategorySource> | null = null;
const warnedMissingCategory = new Set<string>();

const loadCategories = async (
  client: SanityFetcher
): Promise<Map<string, CategorySource>> => {
  if (categoryBySlug) {
    return categoryBySlug;
  }

  const docs = await client.fetch<CategorySource[]>(
    groq`*[_type == "category" && slug.current in $slugs]{
      _id,
      "slug": slug.current,
      featuredResources,
      imageRef,
      description,
      shortDescription
    }`,
    { slugs: [...causeOfDeathSlugs] }
  );

  const bySlug = new Map<string, CategorySource>();
  for (const d of docs) {
    if (d.slug) {
      bySlug.set(d.slug, d);
    }
  }
  categoryBySlug = bySlug;
  return bySlug;
};

const slugInFilter = causeOfDeathSlugs.map((s) => `"${s}"`).join(",");

export default defineMigration({
  title:
    "Backfill causeOfDeath featuredResources / coverImageRef / description / shortDescription from matching category",
  documentTypes: ["causeOfDeath"],
  filter: `slug.current in [${slugInFilter}]`,

  migrate: {
    async document(doc, context) {
      const slug = (doc.slug as { current?: string } | undefined)?.current;
      if (!slug) {
        return [];
      }

      const catBySlug = await loadCategories(context.client);
      const cat = catBySlug.get(slug);
      if (!cat) {
        if (!warnedMissingCategory.has(slug)) {
          warnedMissingCategory.add(slug);
          console.warn(
            `[backfill-cause-of-death] no category found for slug "${slug}"`
          );
        }
        return [];
      }

      const mutations: NodePatch[] = [];

      if (
        Array.isArray(cat.featuredResources) &&
        cat.featuredResources.length > 0
      ) {
        mutations.push(
          at("featuredResources", setIfMissing(cat.featuredResources))
        );
      }
      if (cat.imageRef) {
        mutations.push(at("coverImageRef", setIfMissing(cat.imageRef)));
      }
      if (Array.isArray(cat.description) && cat.description.length > 0) {
        mutations.push(at("description", setIfMissing(cat.description)));
      }
      if (
        typeof cat.shortDescription === "string" &&
        cat.shortDescription.length > 0
      ) {
        mutations.push(
          at("shortDescription", setIfMissing(cat.shortDescription))
        );
      }

      return mutations;
    },
  },
});
