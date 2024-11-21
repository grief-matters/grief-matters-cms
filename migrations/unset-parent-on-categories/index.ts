import { at, defineMigration, unset } from "sanity/migrate";

export default defineMigration({
  title: "Unset parent on categories",
  documentTypes: ["category"],

  migrate: {
    document() {
      return at("parent", unset());
    },
  },
});
