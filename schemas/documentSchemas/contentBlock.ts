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
      type: "array",
      name: "content",
      title: "Content",
      description:
        "Set of predefined building blocks that make up the section of content",
      of: [
        defineArrayMember({ type: "headingText" }),
        defineArrayMember({ type: "richTextContentBlock" }),
        defineArrayMember({ type: "richTextWithHeading" }),
        defineArrayMember({ type: "accessibleImage" }),
        defineArrayMember({ type: "imageRow" }),
        defineArrayMember({ type: "featuredResource" }),
        defineArrayMember({ type: "featuredResources" }),
        // TODO - this will become service provider or something
        defineArrayMember({ type: "featuredCrisisResource" }),
        defineArrayMember({ type: "relativeLink" }),
        defineArrayMember({ type: "resourcePageLink" }),
        defineArrayMember({ type: "categoryPageLink" }),
        defineArrayMember({ type: "pageLinks" }),
        defineArrayMember({ type: "featuredWebsite" }),
        defineArrayMember({ type: "featuredWebsites" }),
        defineArrayMember({ type: "resourceLinks" }),
        defineArrayMember({
          type: "reference",
          name: "personGroup",
          to: [{ type: "personGroup" }],
        }),
        defineArrayMember({
          type: "reference",
          name: "person",
          to: [{ type: "person" }],
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
