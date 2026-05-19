import { defineArrayMember, defineField } from "sanity";

export default defineField({
  group: "classification",
  name: "demographics",
  title: "Demographics",
  type: "array",
  description: "Specific demographics that this resource is targeted towards",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "demographic" }],
    }),
  ],
  validation: (Rule) => Rule.unique(),
});
