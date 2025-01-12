import { v4 as uuid } from "uuid";
import {
  at,
  createIfNotExists,
  defineMigration,
  patch,
  replace,
} from "sanity/migrate";

export default defineMigration({
  title: "Migrate contentBlock object to references in contentGroup",
  documentTypes: ["contentGroup"],
  filter: "defined(contentBlocks) && count(contentBlocks[]._ref) > 0",
  migrate: {
    document(contentGroup) {
      const currentContentBlocks = contentGroup.contentBlocks;

      // Migrate any contentBlocks object to a new document
      if (
        Array.isArray(currentContentBlocks) &&
        currentContentBlocks.length > 0
      ) {
        return currentContentBlocks
          .filter((block) => !block._ref)
          .flatMap((block, i) => {
            const blockId = uuid();

            const { _key, ...blockAttributes } = block || {};

            return [
              createIfNotExists({
                _id: blockId,
                _type: "contentBlock",
                name: `Block ${i + 1} from: ${contentGroup.name}`,
                ...blockAttributes,
              }),
              patch(
                contentGroup._id,
                at(
                  ["contentBlocks"],
                  replace([{ _type: "reference", _ref: blockId }], { _key })
                )
              ),
            ];
          });
      }
    },
  },
});
