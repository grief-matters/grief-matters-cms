import { defineMigration, del } from "sanity/migrate";

export default defineMigration({
  title: "Delete posts and pages",
  documentTypes: ["topic"],
  migrate: {
    document(doc) {
      // Note: If a document has incoming strong references, it can't be deleted by this script.
      return del(doc._id);
    },
  },
});
