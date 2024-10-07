import { defineField, defineType } from "sanity";
import { portableTextDescriptionField } from "../fields";

export default defineType({
  type: "object",
  name: "coreContentGroup",
  title: "Core Content Group",
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: `Core Content Group: ${title}`,
    }),
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "The Title for the Core Content Group",
      validation: (rule) => rule.required(),
    }),
    {
      ...portableTextDescriptionField,
      description:
        "The description will usually displayed to the user. Think of it as an introduction to this collection of content. Leave blank if you do not want anything to be displayed",
    },
    defineField({
      name: "coverImage",
      title: "Core Content Group Cover Image",
      type: "accessibleImage",
      description:
        "A cover image that will be displayed alongside this content group (used as a background image for example)",
    }),
    defineField({
      name: "mainContent",
      title: "Main Content Group",
      description:
        "This is the main Content Group. It is a reference to an existing Content Group",
      type: "reference",
      to: { type: "contentGroup" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "supplementaryContent",
      title: "Supplementary Content Group",
      description:
        "An optional supplementary Content Group. Will usually be displayed as an aside to the Main Content Group. It is a reference to an existing Content Group.",
      type: "reference",
      to: { type: "contentGroup" },
    }),
  ],
});
