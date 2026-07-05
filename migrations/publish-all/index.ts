import { createOrReplace, defineMigration, delete_ } from "sanity/migrate";

const DRAFTS_PREFIX = "drafts.";

export default defineMigration({
  title: "Publish all draft documents",
  filter: `_id in path('${DRAFTS_PREFIX}**')`,
  migrate: {
    document(doc) {
      if (!doc._id.startsWith(DRAFTS_PREFIX)) {
        return;
      }

      const publishedId = doc._id.slice(DRAFTS_PREFIX.length);
      const { _rev, _updatedAt, _type, ...rest } = doc;

      return [
        createOrReplace({ ...rest, _type, _id: publishedId }),
        delete_(doc._id),
      ];
    },
  },
});
