import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "headingText",
  description: "Text to be used as a heading",
  preview: {
    select: {
      text: "text",
    },
    prepare: ({ text }) => ({
      title: "Heading Block",
      subtitle: `Heading Text: ${text}`,
    }),
  },
  fields: [
    defineField({
      name: "text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});
