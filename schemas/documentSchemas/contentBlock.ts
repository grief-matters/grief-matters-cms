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
      name: "name",
      title: "title",
      content: "content",
    },
    prepare: ({ name, content }) => ({
      title: name,
      subtitle: content?.map((x: any) => startCase(x._type)).join(", "),
    }),
  },
  fields: [
    defineField({
      name: "name",
      description:
        "Meaningful name for distinguishing this content block within Sanity (not displayed to users)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
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
        defineArrayMember({ type: "imageRow" }),
        defineArrayMember({ type: "rowOfThree" }),
        defineArrayMember({ type: "rowOfThreeFeaturedResources" }),
        defineArrayMember({ type: "resourceLinks" }),
        defineArrayMember({ type: "resourcePageLinks" }),
        defineArrayMember({ type: "topicContentBlock" }),
        defineArrayMember({ type: "topicCollectionContentBlockNew" }),
        defineArrayMember({ type: "featuredResource" }),
        defineArrayMember({ type: "featuredCrisisResource" }),
        defineArrayMember({ type: "featuredWebsite" }),
        defineArrayMember({ type: "relativeLink" }),
        defineArrayMember({
          type: "reference",
          to: [{ type: "personGroup" }, { type: "person" }],
          options: {
            disableNew: true,
          },
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
