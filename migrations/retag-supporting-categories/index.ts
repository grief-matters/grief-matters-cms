import groq from "groq";
import { at, defineMigration, set } from "sanity/migrate";

type SanityFetcher = {
  fetch: <T>(q: string, params: Record<string, unknown>) => Promise<T>;
};

type RefArrayMember = {
  _key: string;
  _type: "reference";
  _ref: string;
};

// Maps a deprecated "supporting-*" category slug to the slug of the
// lossRelationship that should now represent it. A null entry means the
// category triggers only the audience change (no equivalent loss type).
const CATEGORY_SLUG_TO_LOSS_RELATIONSHIP_SLUG: Record<string, string | null> = {
  "supporting-infertility-loss": "loss-relating-to-infertility",
  "supporting-loss-from-miscarriage": "loss-from-miscarriage",
  "supporting-loss-of-a-child": "loss-of-a-child",
  "supporting-loss-of-a-grandchild": "loss-of-a-grandchild",
  "supporting-loss-of-a-grandparent": "loss-of-a-grandparent",
  "supporting-loss-of-parent": "loss-of-a-parent",
  "supporting-neonatal-loss": "neonatal-loss",
  "supporting-pet-loss": "loss-of-a-pet",
  "supporting-pregnancy-loss": "general-pregnancy-loss",
  "supporting-sibling-loss": "loss-of-a-sibling",
  "supporting-spouse-or-partner-loss": "loss-of-a-spouse-or-partner",
  "supporting-stillbirth-loss": "stillbirth-loss",
  "supporting-those-who-have-lost": null,
};

const AUDIENCE_SLUG = "supporters";

type Resolved = {
  // category _id -> lossRelationship _id (or null for audience-only categories)
  categoryIdToLossRelId: Map<string, string | null>;
  audienceId: string;
};

let resolved: Resolved | null = null;

const resolveOnce = async (client: SanityFetcher): Promise<Resolved> => {
  if (resolved) {
    return resolved;
  }

  const expectedCategorySlugs = Object.keys(
    CATEGORY_SLUG_TO_LOSS_RELATIONSHIP_SLUG
  );
  const expectedLossSlugs = Array.from(
    new Set(
      Object.values(CATEGORY_SLUG_TO_LOSS_RELATIONSHIP_SLUG).filter(
        (s): s is string => s !== null
      )
    )
  );

  const [audienceId, lossRows, catRows] = await Promise.all([
    client.fetch<string | null>(
      groq`*[_type == "audience" && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
      { slug: AUDIENCE_SLUG }
    ),
    client.fetch<Array<{ _id: string; slug: string }>>(
      groq`*[_type == "lossRelationship" && slug.current in $slugs && !(_id in path("drafts.**"))]{
        _id,
        "slug": slug.current
      }`,
      { slugs: expectedLossSlugs }
    ),
    client.fetch<Array<{ _id: string; slug: string }>>(
      groq`*[_type == "category" && slug.current in $slugs && !(_id in path("drafts.**"))]{
        _id,
        "slug": slug.current
      }`,
      { slugs: expectedCategorySlugs }
    ),
  ]);

  if (!audienceId) {
    throw new Error(
      `[retag-supporting-categories] Aborting: no published 'audience' document with slug "${AUDIENCE_SLUG}" exists. Create it before running this migration — without it, documents would be retagged without their audience and become unfindable.`
    );
  }

  const lossIdBySlug = new Map<string, string>();
  for (const row of lossRows) {
    lossIdBySlug.set(row.slug, row._id);
  }
  const missingLoss = expectedLossSlugs.filter((s) => !lossIdBySlug.has(s));
  if (missingLoss.length > 0) {
    throw new Error(
      `[retag-supporting-categories] Aborting: missing lossRelationship documents for slugs: ${missingLoss.join(
        ", "
      )}`
    );
  }

  const catIdToLossId = new Map<string, string | null>();
  for (const row of catRows) {
    const lossSlug = CATEGORY_SLUG_TO_LOSS_RELATIONSHIP_SLUG[row.slug];
    if (lossSlug === undefined) {
      continue;
    }
    catIdToLossId.set(
      row._id,
      lossSlug === null ? null : lossIdBySlug.get(lossSlug) ?? null
    );
  }

  resolved = { categoryIdToLossRelId: catIdToLossId, audienceId };
  return resolved;
};

export default defineMigration({
  title:
    "Retag deprecated 'supporting-*' categories: add equivalent lossRelationships and the supporters audience",
  filter: `defined(categories) && count(categories) > 0`,

  migrate: {
    async document(doc, context) {
      const categories = doc.categories as Array<{ _ref: string }> | undefined;
      if (!Array.isArray(categories) || categories.length === 0) {
        return [];
      }

      const { categoryIdToLossRelId, audienceId } = await resolveOnce(
        context.client
      );

      const refIds = Array.from(new Set(categories.map((c) => c._ref)));
      const matchedCatIds = refIds.filter((id) =>
        categoryIdToLossRelId.has(id)
      );
      if (matchedCatIds.length === 0) {
        return [];
      }

      const mutations = [];

      const existingLossRels =
        (doc.lossRelationships as RefArrayMember[] | undefined) ?? [];
      const existingLossRefIds = new Set(existingLossRels.map((r) => r._ref));

      const newLossRefs: RefArrayMember[] = [];
      const addedLossRefIds = new Set<string>();
      for (const catId of matchedCatIds) {
        const lossId = categoryIdToLossRelId.get(catId);
        if (!lossId) {
          continue;
        }
        if (existingLossRefIds.has(lossId) || addedLossRefIds.has(lossId)) {
          continue;
        }
        addedLossRefIds.add(lossId);
        newLossRefs.push({
          _key: `from-supporting-${lossId}`,
          _type: "reference",
          _ref: lossId,
        });
      }

      if (newLossRefs.length > 0) {
        mutations.push(
          at("lossRelationships", set([...existingLossRels, ...newLossRefs]))
        );
      }

      const existingAudiences =
        (doc.audiences as RefArrayMember[] | undefined) ?? [];
      const hasSupporters = existingAudiences.some(
        (r) => r._ref === audienceId
      );
      if (!hasSupporters) {
        mutations.push(
          at(
            "audiences",
            set([
              ...existingAudiences,
              {
                _key: `from-supporting-${audienceId}`,
                _type: "reference",
                _ref: audienceId,
              },
            ])
          )
        );
      }

      return mutations;
    },
  },
});
