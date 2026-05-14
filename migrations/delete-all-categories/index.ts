import { defineMigration, del } from "sanity/migrate";

export default defineMigration({
  title: "Delete all category documents",
  documentTypes: ["category"],
  migrate: {
    document(doc) {
      return del(doc._id);
    },
  },
});
