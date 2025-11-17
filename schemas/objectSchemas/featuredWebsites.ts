import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "featuredWebsites",
  description: "A collection of Featured Websites",
  title: "Featured Websites",
  fields: [
    defineField({
      name: "websites",
      title: "Websites",
      description: "Select individual websites to appear in this collection",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "website" }],
        }),
      ],
      validation: (Rule) => [Rule.min(1), Rule.unique()],
    }),
  ],
});
