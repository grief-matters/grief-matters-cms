import { defineMigration, del } from "sanity/migrate";

import { targetDocs } from "../01-listicles/target-docs";

const DRAFT_PREFIX = "drafts.";

const targetIds = new Set<string>(targetDocs);

export default defineMigration({
  title: "Delete article documents that were converted into listicles",
  documentTypes: ["article"],

  migrate: {
    document(doc) {
      const baseId = doc._id.startsWith(DRAFT_PREFIX)
        ? doc._id.slice(DRAFT_PREFIX.length)
        : doc._id;

      if (!targetIds.has(baseId)) {
        return [];
      }

      return del(doc._id);
    },
  },
});
