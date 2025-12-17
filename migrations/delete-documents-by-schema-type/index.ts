import { defineMigration, del } from "sanity/migrate";

export default defineMigration({
  title: "Delete documents by schema type",
  documentTypes: ["featuredContent"],
  migrate: {
    document(doc) {
      return del(doc._id);
    },
  },
});
