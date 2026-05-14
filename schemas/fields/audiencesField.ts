import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "audiences",
  title: "Audiences",
  type: "array",
  description: "Specific audiences that this resource will apply to",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "audience" }],
    }),
  ],
  validation: (Rule) => Rule.unique(),
});
