import { at, defineMigration, unset } from "sanity/migrate";

export default defineMigration({
  title: "Unset logo on websites",
  documentTypes: ["website"],

  migrate: {
    document() {
      return at("logo", unset());
    },
  },
});
