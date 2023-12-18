import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "resourcePageLinks",
  fields: [
    defineField({
      name: "links",
      title: "Resource Page Links",
      description:
        "By selecting various options, create links to entire pages of resources",
      type: "array",
      of: [defineArrayMember({ type: "resourcePageLink" })],
    }),
  ],
});
