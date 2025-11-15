import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "headingText",
  description: "Text to be used as a heading",
  fields: [
    defineField({
      name: "text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});
