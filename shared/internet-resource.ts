export const internetResourceTypes = [
  "app",
  "article",
  "blog",
  "book",
  "community",
  "course",
  "essentialService",
  "externalOrg",
  "crisisResource",
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
] as const;
export type InternetResourceType = (typeof internetResourceTypes)[number];

// Resource types the AI quality-scoring branch is allowed to fire on. Keep this
// in sync with the schema side: exactly these types pass `includeQualityScore:
// true` to `createBaseInternetResourceSchema`. Any other type never gets an AI
// score and its `qualityScore` stays empty by design.
export const scorableResourceTypes = [
  "article",
  "blog",
  "forum",
  "peerSupport",
  "printedMaterial",
  "story",
] as const;
export type ScorableResourceType = (typeof scorableResourceTypes)[number];
export function isScorableResourceType(
  key: unknown,
): key is ScorableResourceType {
  return scorableResourceTypes.includes(key as ScorableResourceType);
}

export const taxonomyRefFields = [
  "lossRelationships",
  "causesOfDeath",
  "themes",
  "demographics",
  "griefPhases",
  "griefTypes",
  "contentFunctions",
  "emotionalStates",
] as const;
export type TaxonomyRefField = (typeof taxonomyRefFields)[number];
export function isRefField(key: unknown): key is TaxonomyRefField {
  return taxonomyRefFields.includes(key as TaxonomyRefField);
}
