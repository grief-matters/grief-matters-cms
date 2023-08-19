import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  title: "Resource Details",
  name: "resourceBase",
  type: "object",
  fields: [
    defineField({
      title: "URL",
      name: "resourceUrl",
      type: "url",
    }),
    defineField({
      title: "Source",
      name: "source",
      type: "reference",
      to: [{ type: "website" }],
    }),
    defineField({
      title: "Categories",
      name: "categories",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "category" }] }),
      ],
    }),
    defineField({
      title: "Populations",
      name: "populations",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "population" }] }),
      ],
    }),
  ],
});