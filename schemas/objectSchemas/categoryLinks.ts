import { defineArrayMember, defineField, defineType } from "sanity";
import { titleField } from "../fields";

export default defineType({
  type: "object",
  name: "categoryLinks",
  fields: [
    titleField,
    defineField({
      name: "links",
      type: "array",
      of: [defineArrayMember({ type: "categoryLink" })],
    }),
  ],
});
