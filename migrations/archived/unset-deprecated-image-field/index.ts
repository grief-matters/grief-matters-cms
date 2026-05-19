import { at, defineMigration, unset } from "sanity/migrate";

export default defineMigration({
  title: "Unset deprecated 'image' field",
  documentTypes: [
    "article",
    "video",
    "blog",
    "app",
    "book",
    "supportGroup",
    "forum",
    "webinar",
    "therapyResource",
    "memorial",
    "podcastEpisode",
    "community",
    "peerSupport",
    "story",
    "podcast",
    "printedMaterial",
    "course",
  ],

  migrate: {
    document() {
      return [at("image", unset())];
    },
  },
});
