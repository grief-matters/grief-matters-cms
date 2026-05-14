import { at, defineMigration, unset } from "sanity/migrate";

export default defineMigration({
  title: "Unset categories field on all resource types",
  documentTypes: [
    "app",
    "article",
    "blog",
    "book",
    "community",
    "course",
    "crisisResource",
    "forum",
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
  ],

  migrate: {
    document() {
      return at("categories", unset());
    },
  },
});
