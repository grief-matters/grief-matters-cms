import { v4 as uuid } from "uuid";
import {
  at,
  createIfNotExists,
  defineMigration,
  patch,
  set,
} from "sanity/migrate";

type AccessibleImageValue = {
  _key?: string;
  image?: unknown;
  alt?: string;
  imageSource?: { _ref: string };
};

export default defineMigration({
  title:
    "Migrate imageCollection.images from accessibleImage objects to imageAsset references",
  documentTypes: ["imageCollection"],
  filter: "defined(images) && count(images) > 0 && !defined(imagesRef)",
  migrate: {
    document(doc) {
      const images = doc.images as AccessibleImageValue[] | undefined;
      if (!Array.isArray(images) || images.length === 0) {
        return;
      }

      const entries = images
        .filter((item) => item?.image)
        .map((item) => ({
          item,
          newId: uuid(),
          key: item._key ?? uuid(),
        }));

      if (entries.length === 0) {
        return;
      }

      const creates = entries.map(({ item, newId }) =>
        createIfNotExists({
          _id: newId,
          _type: "imageAsset",
          image: item.image,
          alt: item.alt,
          imageSource: item.imageSource,
        })
      );

      const refs = entries.map(({ newId, key }) => ({
        _type: "reference" as const,
        _key: key,
        _ref: newId,
      }));

      return [...creates, patch(doc._id, at(["imagesRef"], set(refs)))];
    },
  },
});
