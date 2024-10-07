import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "contentBlock",
  description:
    "A Content Block allows you to build a section of content from predefined building blocks",
  preview: {
    select: {
      content: "content",
    },
    prepare: ({ content }) => ({
      title: "Content Block",
      subtitle: `Click to view contents`,
    }),
  },
  fields: [
    defineField({
      type: "array",
      name: "content",
      title: "Content",
      description:
        "Set of predefined building blocks that make up the section of content",
      of: [
        defineArrayMember({ type: "richTextContentBlock" }),
        defineArrayMember({ type: "accessibleImage" }),
        defineArrayMember({ type: "rowOfThree" }),
        defineArrayMember({ type: "rowOfThreeFeaturedResources" }),
        defineArrayMember({ type: "resourceLinks" }),
        defineArrayMember({ type: "resourcePageLinks" }),
        defineArrayMember({ type: "topicContentBlock" }),
        defineArrayMember({ type: "topicCollectionContentBlockNew" }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
