import { defineArrayMember, defineField, defineType } from "sanity";
import { portableTextDescriptionField, slugField } from "../fields";
import { ContentGroupPreview } from "../../components";

export default defineType({
  type: "document",
  name: "contentGroup",
  preview: {
    select: {
      name: "name",
      slug: "slug.current",
    },
    prepare({ name, slug }) {
      return {
        title: name,
        subtitle: slug ? `Page: /${slug}` : "Standard Content Group",
        media: <ContentGroupPreview slug={slug} />,
      };
    },
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
    defineField({
      ...slugField,
      description: `Generating a slug for a Content Group means that a webpage may be automatically generated. Be sure to provide some way for a user to navigate to the page e.g. by adding a 'pageLink' content type to some other area`,
      validation: undefined,
    }),
    defineField({
      name: "image",
      title: "Content Group Cover Image",
      type: "accessibleImage",
      description:
        "A cover image to to be used for this Content Group if appropriate",
    }),
    portableTextDescriptionField,
    defineField({
      name: "contentBlocks",
      title: "Content Blocks",
      description: `Build a Content Group from Content Blocks. You can think of a Content Block as a "section" within the group`,
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: { type: "contentBlock" } }),
      ],
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
