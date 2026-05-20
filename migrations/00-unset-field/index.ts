import { at, defineMigration, unset } from "sanity/migrate";

export default defineMigration({
  title: "Unset field",

  migrate: {
    document() {
      return at("audience", unset());
    },
  },
});
