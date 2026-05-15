import { defineArrayMember, defineField, defineType } from "sanity";

import { imageRowPreviewConfig } from "../../configs/imageRowPreviewConfig";

export default defineType({
  type: "object",
  name: "imageRow",
  title: "Image Row",
  preview: imageRowPreviewConfig,
  fields: [
    defineField({
      name: "images",
      title: "Images",
      description:
        "A selection of images that will be presented as a row. On smaller devices, we may only show the first image, so order matters.",
      type: "array",
      of: [defineArrayMember({ type: "accessibleImage" })],
      validation: (Rule) => Rule.min(2).max(6),
      deprecated: {
        reason:
          "Replaced by imagesRef (array of references to imageAsset documents). Old data has been migrated; this field will be removed in a future release.",
      },
    }),
    defineField({
      name: "imagesRef",
      title: "Images",
      description:
        "A selection of images that will be presented as a row. On smaller devices, we may only show the first image, so order matters.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "imageAsset" }],
        }),
      ],
    }),
  ],
});
