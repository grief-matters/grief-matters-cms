import { defineField } from "sanity";

export default defineField({
  name: "image",
  title: "Image",
  type: "accessibleImage",
  description: `An image to be shown alongside the resource (usually only shown when "Featured")`,
  deprecated: {
    reason:
      "Replaced by imageAssetField (imageRef reference to an imageAsset document). Old data has been migrated; this field will be removed in a future release.",
  },
});
