import { defineArrayMember, defineField } from "sanity";

export default defineField({
  title: "Categories",
  name: "categories",
  type: "array",
  description: "One or more categories that apply to this resource",
  of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
  deprecated: {
    reason:
      "Being replaced by Loss Relationships, Causes of Death, Topics, and Audiences. Use those fields for new resources; existing values will be migrated.",
  },
  validation: (Rule) => [
    Rule.custom((categories, context) => {
      if (
        context.document?._type === "peerSupport" ||
        context.document?._type === "supportGroup" ||
        context.document?._type === "forum" ||
        context.document?._type === "therapyResource"
      ) {
        return true;
      }

      if (
        typeof categories === "undefined" &&
        typeof context.document?.populations === "undefined"
      ) {
        return "You must select a category or population, or the resource will not show anywhere on the website";
      }

      return true;
    }),
    Rule.unique(),
  ],
});
