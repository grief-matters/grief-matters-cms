import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "relativeLink",
  title: "Relative Link",
  description: `A relative link is a URL within our website e.g. '/crisis-resources'`,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      description: "The text that a user will see",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Relative Path",
      description: "A relative path for the desired page",
      type: "url",
      validation: (rule) => [
        rule.required(),
        rule.uri({ allowRelative: true, relativeOnly: true }),
      ],
    }),
  ],
});