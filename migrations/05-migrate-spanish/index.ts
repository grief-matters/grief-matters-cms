import { at, defineMigration, set } from "sanity/migrate";

const INTERNET_RESOURCE_DOCUMENT_TYPES = [
  "app",
  "article",
  "blog",
  "book",
  "community",
  "course",
  "crisisResource",
  "externalOrg",
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
  "website",
] as const;

export default defineMigration({
  title:
    "Set 'availableLanguages' from 'hasSpanishVersion' on internet resources",
  documentTypes: [...INTERNET_RESOURCE_DOCUMENT_TYPES],
  migrate: {
    document(doc) {
      const languages =
        doc.hasSpanishVersion === true ? ["english", "spanish"] : ["english"];

      return [at("availableLanguages", set(languages))];
    },
  },
});
