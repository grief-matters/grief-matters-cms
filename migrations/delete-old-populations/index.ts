import { defineMigration, del } from "sanity/migrate";

export default defineMigration({
  title:
    "Delete old 'population' documents (run after retag-resources-from-populations)",
  documentTypes: ["population"],
  migrate: {
    document(doc) {
      return del(doc._id);
    },
  },
});
