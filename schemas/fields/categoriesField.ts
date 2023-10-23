import { defineArrayMember, defineField } from "sanity";

export default defineField({
  title: "Categories",
  name: "categories",
  type: "array",
  description: "One or more categories that apply to this resource",
  of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
  validation: (Rule) => [
    Rule.custom((categories, context) => {
      if (
        !context.document?.hasBroadFocus &&
        typeof categories === "undefined" &&
        typeof context.document?.populations === "undefined"
      ) {
        return "You must select a category if no population has been specified";
      }

      return true;
    }),
    Rule.unique(),
  ],
});
