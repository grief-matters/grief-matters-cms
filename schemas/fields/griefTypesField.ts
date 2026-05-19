import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "griefTypes",
  title: "Grief Type",
  type: "array",
  description: "The type of grief that this resource addresses",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "griefType" }],
    }),
  ],
  validation: (Rule) => Rule.unique(),
});
