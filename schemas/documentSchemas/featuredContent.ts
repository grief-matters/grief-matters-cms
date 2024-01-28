import { defineField, defineType } from "sanity";
import { portableTextDescriptionField, titleField } from "../fields";

export default defineType({
  name: "featuredContent",
  title: "Featured Content",
  type: "document",
  fields: [
    defineField({
      ...titleField,
      description: "A heading for the feature panel",
    }),
    portableTextDescriptionField,
    defineField({
      name: "content",
      title: "Content",
      description:
        "Create a block of featured content from predefined building blocks",
      type: "array",
      of: [
        { type: "rowOfThree" },
        { type: "richTextContentBlock" },
        { type: "resourceLinks" },
        { type: "resourcePageLinks" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredContentFooterLink",
      title: "Footer Link",
      description: "The link to be shown in the footer of the feature panel",
      type: "resourcePageLink",
    }),
  ],
});
