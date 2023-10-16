import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "rowOfThree",
  title: "Image Row (3)",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "accessibleImage" })],
      validation: (Rule) => Rule.length(3),
    }),
  ],
});
