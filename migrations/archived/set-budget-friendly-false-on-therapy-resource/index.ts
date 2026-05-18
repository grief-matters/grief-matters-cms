import { at, defineMigration, set } from "sanity/migrate";

export default defineMigration({
  title: "Set budgetFriendly to false on all therapyResource documents",
  documentTypes: ["therapyResource"],

  migrate: {
    document() {
      return at("budgetFriendly", set(false));
    },
  },
});
