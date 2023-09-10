import { defineArrayMember, defineField } from "sanity";

export default defineField({
  title: "Categories",
  name: "categories",
  type: "array",
  of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
});
