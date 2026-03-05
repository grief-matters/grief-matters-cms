import { at, defineMigration, unset } from "sanity/migrate";

export default defineMigration({
  title: "Remove field on type",
  documentTypes: ["category"],

  migrate: {
    document() {
      return at("featuredStories", unset());
    },
  },
});
