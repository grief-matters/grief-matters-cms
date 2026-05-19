import groq from "groq";
import { at, defineMigration, set } from "sanity/migrate";

type TagType = "lossRelationship" | "causeOfDeath" | "topic";

type TagDocInfo = {
  _id: string;
  _type: TagType;
};

type CategoryInfo = {
  slug: string;
  title: string;
};

type SanityFetcher = {
  fetch: <T>(q: string, params: Record<string, unknown>) => Promise<T>;
};

const FIELD_BY_TYPE: Record<TagType, string> = {
  lossRelationship: "lossRelationships",
  causeOfDeath: "causesOfDeath",
  topic: "topics",
};

// Loaded once on first call to document(); reused for the rest of the run.
let tagDocsBySlug: Map<string, TagDocInfo> | null = null;
const categoryCache = new Map<string, CategoryInfo | null>();
const warnedNoTagDoc = new Set<string>();

const loadTagDocs = async (
  client: SanityFetcher
): Promise<Map<string, TagDocInfo>> => {
  if (tagDocsBySlug) {
    return tagDocsBySlug;
  }

  const docs = await client.fetch<
    Array<{ _id: string; _type: TagType; slug?: string }>
  >(
    groq`*[_type in ["lossRelationship","causeOfDeath","topic"] && defined(slug.current)]{
      _id,
      _type,
      "slug": slug.current
    }`,
    {}
  );

  const bySlug = new Map<string, TagDocInfo>();
  for (const d of docs) {
    if (!d.slug) {
      continue;
    }
    const existing = bySlug.get(d.slug);
    if (existing) {
      console.warn(
        `[retag-resources-from-categories] slug "${d.slug}" claimed by both ${existing._type} (${existing._id}) and ${d._type} (${d._id}) — keeping the first`
      );
      continue;
    }
    bySlug.set(d.slug, { _id: d._id, _type: d._type });
  }

  tagDocsBySlug = bySlug;
  return bySlug;
};

const loadCategories = async (
  client: SanityFetcher,
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

type RefArrayMember = {
  _key: string;
  _type: "reference";
  _ref: string;
};

export default defineMigration({
  title:
    "Populate lossRelationships / causesOfDeath / topics from existing 'categories'",
  filter: `defined(categories) && count(categories) > 0`,

  migrate: {
    async document(doc, context) {
      const categories = doc.categories as Array<{ _ref: string }> | undefined;
      if (!Array.isArray(categories) || categories.length === 0) {
        return [];
      }

      const refIds = Array.from(new Set(categories.map((c) => c._ref)));
      const [tagBySlug, catInfoById] = await Promise.all([
        loadTagDocs(context.client),
        loadCategories(context.client, refIds),
      ]);

      const grouped: Record<TagType, RefArrayMember[]> = {
        lossRelationship: [],
        causeOfDeath: [],
        topic: [],
      };
      const seen: Record<TagType, Set<string>> = {
        lossRelationship: new Set(),
        causeOfDeath: new Set(),
        topic: new Set(),
      };

      for (const refId of refIds) {
        const cat = catInfoById.get(refId);
        if (!cat) {
          continue;
        }

        const tag = tagBySlug.get(cat.slug);
        if (!tag) {
          if (!warnedNoTagDoc.has(cat.slug)) {
            warnedNoTagDoc.add(cat.slug);
            console.warn(
              `[retag-resources-from-categories] no tag doc found for category slug "${cat.slug}" — did decompose-categories run?`
            );
          }
          continue;
        }

        if (seen[tag._type].has(tag._id)) {
          continue;
        }
        seen[tag._type].add(tag._id);

        grouped[tag._type].push({
          _key: cat.slug,
          _type: "reference",
          _ref: tag._id,
        });
      }

      return (Object.entries(grouped) as Array<[TagType, RefArrayMember[]]>)
        .filter(([, refs]) => refs.length > 0)
        .map(([type, refs]) => at(FIELD_BY_TYPE[type], set(refs)));
    },
  },
});
