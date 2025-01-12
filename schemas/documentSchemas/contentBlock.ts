import { defineArrayMember, defineField, defineType } from "sanity";
import { portableTextDescriptionField } from "../fields";
import startCase from "lodash/startCase";

export default defineType({
  type: "document",
  name: "contentBlock",
  description:
    "A Content Block allows you to build a section of content from predefined building blocks",
  preview: {
    select: {
      content: "content",
    },
    prepare: ({ content }) => ({
      title: `Content Block`,
      subtitle: content?.map((x: any) => startCase(x._type)).join(", "),
    }),
  },
  fields: [
    defineField({
      title: "Title",
      name: "title",
      type: "string",
      description: "Optional descriptive title for the Content Block.",
      validation: (Rule) => [
        Rule.max(60).warning("Headings for content blocks should be short"),
      ],
    }),
    defineField({
      ...portableTextDescriptionField,
      description:
        "Optional description for the Content Block. Will act as lead in text in most cases",
    }),
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
        defineArrayMember({ type: "featuredResource" }),
        defineArrayMember({ type: "featuredCrisisResource" }),
        defineArrayMember({ type: "featuredWebsite" }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
