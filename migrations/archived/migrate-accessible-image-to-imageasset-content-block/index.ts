import { v4 as uuid } from "uuid";
import {
  at,
  createIfNotExists,
  defineMigration,
  patch,
  replace,
  set,
} from "sanity/migrate";

type AccessibleImageValue = {
  _key?: string;
  image?: unknown;
  alt?: string;
  imageSource?: { _ref: string };
};

type ContentItem =
  | ({ _type: "accessibleImage"; _key?: string } & AccessibleImageValue)
  | {
      _type: "imageRow";
      _key?: string;
      images?: AccessibleImageValue[];
      imagesRef?: unknown;
    }
  | { _type: string; _key?: string };

export default defineMigration({
  title:
    "Migrate contentBlock.content accessibleImage items (incl nested imageRow.images) to imageAsset references",
  documentTypes: ["contentBlock"],
  filter:
    'count(content[_type == "accessibleImage"]) > 0 || count(content[_type == "imageRow" && defined(images) && !defined(imagesRef)]) > 0',
  migrate: {
    document(doc) {
      const content = doc.content as ContentItem[] | undefined;
      if (!Array.isArray(content) || content.length === 0) {
        return;
      }

      const creates: ReturnType<typeof createIfNotExists>[] = [];
      const patches: ReturnType<typeof patch>[] = [];

      for (const item of content) {
        if (item._type === "accessibleImage") {
          const inline = item as AccessibleImageValue & { _key?: string };
          if (!inline.image || !inline._key) {
            continue;
          }

          const newId = uuid();
          creates.push(
            createIfNotExists({
              _id: newId,
              _type: "imageAsset",
              image: inline.image,
              alt: inline.alt,
              imageSource: inline.imageSource,
            })
          );

          patches.push(
            patch(
              doc._id,
              at(
                ["content"],
                replace(
                  [
                    {
                      _type: "reference",
                      _key: inline._key,
                      _ref: newId,
                    },
                  ],
                  { _key: inline._key }
                )
              )
            )
          );
        } else if (item._type === "imageRow") {
          const row = item as {
            _key?: string;
            images?: AccessibleImageValue[];
            imagesRef?: unknown;
          };
          if (
            !row._key ||
            row.imagesRef ||
            !Array.isArray(row.images) ||
            row.images.length === 0
          ) {
            continue;
          }

          const entries = row.images
            .filter((nested) => nested?.image)
            .map((nested) => ({
              nested,
              newId: uuid(),
              key: nested._key ?? uuid(),
            }));

          if (entries.length === 0) {
            continue;
          }

          for (const { nested, newId } of entries) {
            creates.push(
              createIfNotExists({
                _id: newId,
                _type: "imageAsset",
                image: nested.image,
                alt: nested.alt,
                imageSource: nested.imageSource,
              })
            );
          }

          const refs = entries.map(({ newId, key }) => ({
            _type: "reference" as const,
            _key: key,
            _ref: newId,
          }));

          patches.push(
            patch(
              doc._id,
              at(["content", { _key: row._key }, "imagesRef"], set(refs))
            )
          );
        }
      }

      if (creates.length === 0 && patches.length === 0) {
        return;
      }

      return [...creates, ...patches];
    },
  },
});
