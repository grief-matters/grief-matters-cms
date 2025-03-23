import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "personGroupBlock",
  fields: [
    defineField({
      name: "group",
      type: "reference",
      to: [{ type: "personGroup" }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      description: "This group should be presented in a more prominent way",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
