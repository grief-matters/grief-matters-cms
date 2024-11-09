import { defineField, defineType } from "sanity";

export default defineType({
  name: "resourceEvaluation",
  type: "document",
  fields: [
    defineField({
      title: "User ID",
      name: "userId",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Resource ID",
      name: "resourceId",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Rating",
      name: "rating",
      type: "number",
      validation: (rule) => rule.min(1).max(10).required(),
    }),
  ],
});
