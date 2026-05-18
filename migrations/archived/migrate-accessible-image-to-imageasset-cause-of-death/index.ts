import { v4 as uuid } from "uuid";
import {
  at,
  createIfNotExists,
  defineMigration,
  patch,
  set,
} from "sanity/migrate";

type AccessibleImageValue = {
  image?: unknown;
  alt?: string;
  imageSource?: { _ref: string };
};

export default defineMigration({
  title:
    "Migrate causeOfDeath.coverImage from accessibleImage object to imageAsset reference",
  documentTypes: ["causeOfDeath"],
  filter: "defined(coverImage) && !defined(coverImageRef)",
  migrate: {
    document(doc) {
      const inline = doc.coverImage as AccessibleImageValue | undefined;
      if (!inline?.image) {
        return;
      }

      const newId = uuid();
      return [
        createIfNotExists({
          _id: newId,
          _type: "imageAsset",
          image: inline.image,
          alt: inline.alt,
          imageSource: inline.imageSource,
        }),
        patch(
          doc._id,
          at(["coverImageRef"], set({ _type: "reference", _ref: newId }))
        ),
      ];
    },
  },
});
