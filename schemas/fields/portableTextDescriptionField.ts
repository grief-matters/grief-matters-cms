import { defineField, defineArrayMember } from "sanity";

export default defineField({
  title: "Description",
  name: "description",
  type: "array",
  description:
    "Rich text description. Supports links and other rich text formatting",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
    }),
  ],
});
