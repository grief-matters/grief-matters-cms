import { at, defineMigration, unset } from "sanity/migrate";

export default defineMigration({
  title: "Remove hasBroadFocus on support types",
  documentTypes: ["peerSupport", "supportGroup", "forum", "therapyResource"],

  migrate: {
    document() {
      return at("hasBroadFocus", unset());
    },
  },
});
