import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "richTextWithHeading",
  description: `Can be used to create a heading/text grouping that will be treated as a single unit of content (e.g. like a callout)`,
  fields: [
    defineField({
      name: "heading",
      type: "headingText",
      validation: (rule) => rule.required(),
    }),
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
