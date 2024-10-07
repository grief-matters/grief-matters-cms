import { defineArrayMember, defineField, defineType } from "sanity";
import { portableTextDescriptionField } from "../fields";

export default defineType({
  type: "document",
  name: "contentGroup",
  preview: {
    select: {
      name: "name",
      title: "title",
    },
    prepare: ({ name, title }) => ({
      title: name,
      subtitle: `Display Label: ${title}`,
    }),
  },
  fields: [
    defineField({
      name: "name",
      description:
        "Meaningful name for distinguishing this content group within Sanity (not displayed to users)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      type: "string",
      name: "title",
      description:
        "An optional title to display to users. Leave blank if you want an untitled content group.",
    }),
    portableTextDescriptionField,
    defineField({
      name: "contentBlocks",
      title: "Content Blocks",
      description: `Build a Content Group from Content Blocks. You can think of a Content Block as a "section" within the group`,
      type: "array",
      of: [defineArrayMember({ type: "contentBlock" })],
    }),
    defineField({
      name: "contentGroupJumpLink",
      title: "Jump Link",
      description: "A link to take a user to another related page",
      type: "resourcePageLink",
      readOnly: (ctx) =>
        typeof ctx.document?.manualFeaturedContentFooterLink !== "undefined",
    }),
    defineField({
      name: "relativeContentGroupJumpLink",
      title: "Jump Link (manual)",
      description:
        "A link to take a user to another related page. Only use a manually entered jump link if you are certain the route exists",
      type: "object",
      readOnly: (ctx) =>
        typeof ctx.document?.featuredContentFooterLink !== "undefined",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          description: "The text that a user will see",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "url",
          title: "Relative Path",
          description: "A relative path for the desired page",
          type: "url",
          validation: (Rule) =>
            Rule.uri({ allowRelative: true, relativeOnly: true }),
        }),
      ],
    }),
  ],
});
