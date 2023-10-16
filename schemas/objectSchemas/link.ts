import { defineField, defineType } from "sanity";
import { urlField } from "../fields";

export default defineType({
  name: "link",
  type: "object",
  fields: [
    urlField,
    defineField({
      type: "string",
      name: "label",
    }),
  ],
});
