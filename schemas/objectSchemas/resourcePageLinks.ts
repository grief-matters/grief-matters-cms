import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "resourcePageLinks",
  preview: {
    prepare: () => ({
      title: "Resource Page Links",
      subtitle: "A collection of links to pages of resources",
    }),
  },
  fields: [
    defineField({
      name: "links",
      title: "Resource Page Links Collection",
      description:
        "By selecting various options, create links to entire pages of resources",
      type: "array",
      of: [defineArrayMember({ type: "resourcePageLink" })],
    }),
  ],
});
