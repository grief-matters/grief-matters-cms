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
    defineField({
      name: "headingLevel",
      title: "Heading Level",
      type: "string",
      options: {
        list: [
          { title: "Heading 1", value: "h1" },
          { title: "Heading 2", value: "h2" },
        ],
      },
      initialValue: "h1",
      validation: (rule) => rule.required(),
    }),
  ],
});
