import { randomUUID } from "node:crypto";
import {
  create,
  defineMigration,
  delete_,
  type Mutation,
} from "sanity/migrate";

/**
 * Retypes a specific set of `article` documents as `essentialService`.
 *
 * Sanity does not allow mutating `_type` or `_id` on an existing document,
 * so for each target we create a new `essentialService` document with the
 * mapped field values and delete the original.
 *
 * Caveats:
 * - The new documents get fresh `_id`s. Any strong references to the old
 *   `_id`s will block the delete and will need to be repointed first.
 * - Classification taxonomies not present on `essentialService`
 *   (lossRelationships, causesOfDeath, griefPhases, griefTypes,
 *   contentFunctions, emotionalStates, audienceRole) are dropped.
 * - `essentialService` has no `contactMethods` populated from `article`
 *   (articles don't carry contact info) — operators will need to set
 *   these by hand after migration if needed.
 */

const PUBLISHED_IDS = [
  "21f59da3-1b5c-4b38-b3eb-128a3b55cc7d", // Autistic People of Color Fund
  "imported-article-3456984175", // Free Confidential Helpline (SAMHIN)
  "c7710f02-a3d3-4fa5-a72d-61657d76cd40", // The Bradley Angle Healing Roots Program
];

const ALL_TARGET_IDS = PUBLISHED_IDS.flatMap((id) => [id, `drafts.${id}`]);

const DROP_FIELDS = new Set([
  "lossRelationships",
  "causesOfDeath",
  "griefPhases",
  "griefTypes",
  "contentFunctions",
  "emotionalStates",
  "audienceRole",
]);

const SYSTEM_FIELDS = new Set([
  "_id",
  "_rev",
  "_type",
  "_createdAt",
  "_updatedAt",
  "_originalId",
]);

function buildEssentialService(doc: Record<string, unknown>) {
  const carried: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(doc)) {
    if (SYSTEM_FIELDS.has(key)) {
      continue;
    }
    if (DROP_FIELDS.has(key)) {
      continue;
    }
    carried[key] = value;
  }

  const originalId = doc._id as string;
  const isDraft = originalId.startsWith("drafts.");
  const newId = isDraft ? `drafts.${randomUUID()}` : randomUUID();

  return {
    _id: newId,
    _type: "essentialService",
    ...carried,
  };
}

export default defineMigration({
  title: "Retype selected article documents as essentialService",
  documentTypes: ["article"],
  filter: `_id in [${ALL_TARGET_IDS.map((id) => `"${id}"`).join(", ")}]`,
  migrate: {
    document(doc) {
      const mutations: Mutation[] = [
        create(buildEssentialService(doc as Record<string, unknown>)),
        delete_(doc._id),
      ];
      return mutations;
    },
  },
});
