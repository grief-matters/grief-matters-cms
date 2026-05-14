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
});
