import { defineArrayMember, defineField, defineType } from "sanity";

import { simpleDescriptionField, slugField } from "../fields";
import { ContentGroupPreview } from "../../components";

export default defineType({
  type: "document",
  name: "contentGroup",
  description:
    "A 'Content Group' is usually used to to manage page content on the website",
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
      ...simpleDescriptionField,
      description:
        "Some introductory text for this Content Group. Usually shown in Page Headers (may not be shown in all circumstances)",
      rows: 3,
    }),
    defineField({
      ...slugField,
      description: `Slugs are used to link specific content to a specific page e.g. a slug of 'donate' will be linked to the 'donate' page. Where there is no existing page, one will be generated. Speak to a project developer if you are unsure.`,
      validation: undefined,
    }),
    defineField({
      name: "image",
      title: "Content Group Cover Image",
      type: "accessibleImage",
      description:
        "A cover image to to be used for this Content Group if appropriate",
    }),
    defineField({
      name: "contentBlocks",
      title: "Content Blocks",
      description: `Build a Content Group from Content Blocks. You can think of a Content Block as a "section" within the group`,
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: { type: "contentBlock" } }),
      ],
    }),
  ],
});
