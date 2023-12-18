import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "richTextContentBlock",
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
