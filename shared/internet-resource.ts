export const internetResourceTypes = [
  "app",
  "article",
  "blog",
  "book",
  "community",
  "course",
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
