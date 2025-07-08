import { at, defineMigration, unset } from "sanity/migrate";

const refId = "imported-website-4157407700";

export default defineMigration({
  title: "Unlink 'sourceWebsite' by ID",
  filter: `sourceWebsite._ref == "${refId}"`,
  migrate: {
    document() {
      return at("sourceWebsite", unset());
    },
  },
});
