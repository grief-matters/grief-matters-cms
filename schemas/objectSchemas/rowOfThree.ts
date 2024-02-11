import { defineArrayMember, defineField, defineType } from "sanity";

import { rowOfThreePreviewConfig } from "../../configs/rowOfThreePreviewConfig";

export default defineType({
  type: "object",
  name: "rowOfThree",
  title: "Image Row (3)",
  preview: rowOfThreePreviewConfig,
  fields: [
    defineField({
      name: "images",
      title: "Images",
      description:
        "A selection of 3 images that will be presented as a row. On smaller devices, we may only show the first image, so order matters.",
      type: "array",
      of: [defineArrayMember({ type: "accessibleImage" })],
      validation: (Rule) => Rule.length(3),
    }),
  ],
});
