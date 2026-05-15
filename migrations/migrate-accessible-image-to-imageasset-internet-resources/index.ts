import { v4 as uuid } from "uuid";
import {
  at,
  createIfNotExists,
  defineMigration,
  patch,
  set,
} from "sanity/migrate";
import { INTERNET_RESOURCE_TYPES } from "../../constants";

type AccessibleImageValue = {
  image?: unknown;
  alt?: string;
  imageSource?: { _ref: string };
};

export default defineMigration({
  title:
    "Migrate internet resource .image (accessibleImage object) to .imageRef (imageAsset reference) across all resource types",
  documentTypes: [...INTERNET_RESOURCE_TYPES],
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
