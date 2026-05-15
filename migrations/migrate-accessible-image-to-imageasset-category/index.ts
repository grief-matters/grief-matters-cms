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
    "Migrate category.image from accessibleImage object to imageAsset reference",
  documentTypes: ["category"],
  filter: "defined(image) && !defined(imageRef)",
  migrate: {
    document(doc) {
      const inline = doc.image as AccessibleImageValue | undefined;
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
          at(["imageRef"], set({ _type: "reference", _ref: newId }))
        ),
      ];
    },
  },
});
