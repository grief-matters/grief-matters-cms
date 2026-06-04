import { randomUUID } from "node:crypto";
import {
  create,
  defineMigration,
  delete_,
  type Mutation,
} from "sanity/migrate";

/**
 * Retypes a specific set of `crisisResource` documents as `essentialService`.
 *
 * Sanity does not allow mutating `_type` or `_id` on an existing document,
 * so for each target we create a new `essentialService` document with the
 * mapped field values and delete the original.
 *
 * Caveats:
 * - The new documents get fresh `_id`s. Any strong references to the old
 *   `_id`s will block the delete and will need to be repointed first.
 * - `crisisResource.logo` (raw image) has no place to land on
 *   `essentialService` (which uses `imageRef` -> imageAsset) and is dropped.
 * - Classification taxonomies not present on `essentialService`
 *   (lossRelationships, causesOfDeath, griefPhases, griefTypes,
 *   contentFunctions, emotionalStates) are dropped.
 */

const PUBLISHED_IDS = [
  "890d9ef6-3e22-4f05-8f2e-87074311a470", // BenefitsCheckUp
  "imported-crisisresource-253226612", // Dial 2-1-1
  "daf5ea3c-7ebc-463b-872b-5aff63c219a0", // Feeding America
  "c732b2d9-ec91-4829-91e8-031d4ab30c87", // Find Your Local Food Bank
  "23140069-93d0-41fc-86e3-b3d067d16e64", // Food and Nutrition Service (USDA)
  "baabcf21-aea5-4119-8d09-f3a4a0d7499d", // USAGov / Government Benefits
  "98f3c986-5ad0-4b84-bf3e-6d3e6c49a7cf", // HealthCare.gov
  "imported-crisisresource-3426045339", // NAMI HelpLine
  "7834dbc7-92bc-4b00-8570-f304805860b2", // NAMI Teen & Young Adult HelpLine
  "228df62d-fbc4-44b1-9f2c-5602c1bcbef7", // National Resource Directory
  "0efa153e-fa50-4f5c-a9aa-4cc6e25a28cc", // SAMHSA's National Helpline
  "2a7d1ba2-959a-40af-ae39-cb3a60d790c3", // The Salvation Army
  "ea78a899-25f0-4a0e-b71d-356d89e6cfb9", // U.S. Dept. of Health and Human Services
  "274e43de-78ff-4be1-a26b-ebbc62cf9662", // U.S. Dept. of Housing and Urban Development
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
  "logo",
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
  title: "Retype selected crisisResource documents as essentialService",
  documentTypes: ["crisisResource"],
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
