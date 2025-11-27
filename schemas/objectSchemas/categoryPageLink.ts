import { defineField, defineType } from "sanity";

export default defineType({
  name: "categoryPageLink",
  type: "object",
  preview: {
    select: {
      label: "label",
      category: "category.title",
    },
    prepare: ({ label, category }) => ({
      title: "Category Page Link",
      subtitle: `to: ${label ?? category}`,
    }),
  },
  fields: [
    defineField({
      name: "category",
      title: "Category",
      description: "The category page to take the user to",
      type: "reference",
      to: [{ type: "category" }],
      options: {
        disableNew: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      description:
        "The text that a user will see (leave blank to use the standard category name)",
      type: "string",
    }),
  ],
});
