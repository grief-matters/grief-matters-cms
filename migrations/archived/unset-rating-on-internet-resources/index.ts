import { at, defineMigration, unset } from "sanity/migrate";
import { INTERNET_RESOURCE_TYPES } from "../../../constants";

export default defineMigration({
  title: "Unset deprecated rating field on all internet resources",
  documentTypes: [...INTERNET_RESOURCE_TYPES],
  filter: "defined(rating)",
  migrate: {
    document() {
      return at("rating", unset());
    },
  },
});
