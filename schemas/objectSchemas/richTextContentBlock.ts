import { defineArrayMember, defineField, defineType } from "sanity";
import { richTextContentBlockPreviewConfig } from "../../configs/richTextContentBlockPreviewConfig";

export default defineType({
  type: "object",
  name: "richTextContentBlock",
  preview: richTextContentBlockPreviewConfig,
  description:
    "Rich Text content block. Supports links and other rich text formatting",
  fields: [
    defineField({
      name: "portableText",
      type: "array",
      description: `This is a "rich text" field, meaning that it supports things like bold, italic, and links.`,
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
    }),
  ],
});
