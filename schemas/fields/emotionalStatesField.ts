import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "emotionalStates",
  title: "Emotional States",
  type: "array",
  description:
    "Add the relevant Emotional States covered by the resource if applicable",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "emotionalState" }],
    }),
  ],
  validation: (Rule) => [Rule.unique()],
});
