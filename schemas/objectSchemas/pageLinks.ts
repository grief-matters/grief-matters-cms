import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "pageLinks",
  preview: {
    prepare: () => ({
      title: "Page Links",
      subtitle: "A collection of links to pages",
    }),
  },
  fields: [
    defineField({
      name: "links",
      title: "Resource Page Links Collection",
      description:
        "By selecting various options, create smart links to entire pages of resources or if you know the route to a page, add it directly",
      type: "array",
      of: [
        defineArrayMember({ type: "resourcePageLink" }),
        defineArrayMember({ type: "categoryPageLink" }),
        defineArrayMember({ type: "relativeLink" }),
      ],
    }),
    defineField({
      name: "isProminent",
      type: "boolean",
      title: "Emphasized",
      description:
        "Whether this set of links should be shown more prominently than other collections shown in the same context",
      initialValue: false,
    }),
    defineField({
      name: "showImages",
      type: "boolean",
      title: "Show Images",
      description:
        "Whether to show images alongside the link. The image used will be selected automatically based on the configuration of the links",
      initialValue: false,
    }),
  ],
});
