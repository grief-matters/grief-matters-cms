import { defineArrayMember, defineField } from "sanity";

export default defineField({
  title: "Categories",
  name: "categories",
  type: "array",
  description: "One or more categories that apply to this resource",
  of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
  validation: (Rule) => Rule.required(),
});
