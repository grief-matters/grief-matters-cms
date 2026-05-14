import groq from "groq";
import { at, defineMigration, set, unset } from "sanity/migrate";

type SanityFetcher = {
  fetch: <T>(q: string, params: Record<string, unknown>) => Promise<T>;
};

type RefArrayMember = {
  _key: string;
  _type: "reference";
  _ref: string;
};

type ResourcePageLinkItem = {
  _key: string;
  _type: "resourcePageLink";
  population?: { _ref: string; _type: "reference" };
  audience?: { _ref: string; _type: "reference" };
  [key: string]: unknown;
};

type PageLinksItem = {
  _key: string;
  _type: "pageLinks";
  links?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

type ContentItem = Record<string, unknown> & { _type: string; _key: string };

// Map: old population _id → new audience _id (joined on slug). Loaded once.
let populationToAudience: Map<string, string> | null = null;
const warnedMissingAudience = new Set<string>();

const loadPopulationToAudienceMap = async (
  client: SanityFetcher
): Promise<Map<string, string>> => {
  if (populationToAudience) {
    return populationToAudience;
  }

  const rows = await client.fetch<
    Array<{ _id: string; slug?: string; audienceId?: string }>
  >(
    groq`*[_type == "population" && defined(slug.current)]{
      _id,
      "slug": slug.current,
      "audienceId": *[_type == "audience" && slug.current == ^.slug.current][0]._id
    }`,
    {}
  );

  const map = new Map<string, string>();
  for (const row of rows) {
    if (!row.slug || !row.audienceId) {
      if (!warnedMissingAudience.has(row._id)) {
        warnedMissingAudience.add(row._id);
        console.warn(
          `[retag-resources-from-populations] no matching audience for population ${
            row._id
          } (slug "${
            row.slug ?? "?"
          }") — did create-audiences-from-populations run?`
        );
      }
      continue;
    }
    map.set(row._id, row.audienceId);
  }

  populationToAudience = map;
  return map;
};

const remapRef = (
  ref: RefArrayMember,
  map: Map<string, string>
): RefArrayMember | null => {
  const newId = map.get(ref._ref);
  if (!newId) {
    return null;
  }
  return { ...ref, _ref: newId };
};

const remapSingleRef = (
  ref: { _ref: string; _type: "reference"; [k: string]: unknown },
  map: Map<string, string>
): { _ref: string; _type: "reference"; [k: string]: unknown } | null => {
  const newId = map.get(ref._ref);
  if (!newId) {
    return null;
  }
  return { ...ref, _ref: newId };
};

const rewriteResourcePageLink = (
  item: ResourcePageLinkItem,
  map: Map<string, string>
): ResourcePageLinkItem => {
  if (!item.population) {
    return item;
  }
  const { population, ...rest } = item;
  const newRef = remapSingleRef(population, map);
  if (newRef) {
    return { ...rest, audience: newRef } as ResourcePageLinkItem;
  }
  return rest as ResourcePageLinkItem;
};

export default defineMigration({
  title:
    "Retag 'populations' → 'audiences' on resources, and rewrite resourcePageLink.population → audience inside contentBlocks",

  migrate: {
    async document(doc, context) {
      const map = await loadPopulationToAudienceMap(context.client);
      const mutations = [];

      // 1. Resources with a populations array: rebuild as audiences, drop populations
      const populations = doc.populations as RefArrayMember[] | undefined;
      if (Array.isArray(populations)) {
        if (populations.length > 0) {
          const newRefs = populations
            .map((r) => remapRef(r, map))
            .filter((r): r is RefArrayMember => r !== null);
          if (newRefs.length > 0) {
            mutations.push(at("audiences", set(newRefs)));
          }
        }
        mutations.push(at("populations", unset()));
      }

      // 2. contentBlock.content[] — rewrite resourcePageLink items (and any
      //    nested inside pageLinks.links[])
      if (doc._type === "contentBlock" && Array.isArray(doc.content)) {
        const content = doc.content as ContentItem[];
        let changed = false;

        const newContent = content.map((item) => {
          if (item._type === "resourcePageLink") {
            const rpl = item as ResourcePageLinkItem;
            if (rpl.population) {
              changed = true;
              return rewriteResourcePageLink(rpl, map);
            }
            return rpl;
          }

          if (item._type === "pageLinks") {
            const pl = item as PageLinksItem;
            if (!Array.isArray(pl.links)) {
              return pl;
            }

            const linksChanged = pl.links.some(
              (l) =>
                (l as ContentItem)._type === "resourcePageLink" &&
                (l as ResourcePageLinkItem).population
            );
            if (!linksChanged) {
              return pl;
            }

            changed = true;
            return {
              ...pl,
              links: pl.links.map((l) => {
                if (
                  (l as ContentItem)._type === "resourcePageLink" &&
                  (l as ResourcePageLinkItem).population
                ) {
                  return rewriteResourcePageLink(
                    l as ResourcePageLinkItem,
                    map
                  );
                }
                return l;
              }),
            };
          }

          return item;
        });

        if (changed) {
          mutations.push(at("content", set(newContent)));
        }
      }

      return mutations;
    },
  },
});
