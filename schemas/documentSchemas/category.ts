import { defineArrayMember, defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";
import { featuredResourcesField, slugField, titleField } from "../fields";

export default defineType({
  name: "category",
  title: "Topic",
  description: "A category used to classify resources",
  icon: TagsIcon,
  type: "document",
  preview: {
    select: {
      displayTitle: "displayTitle",
      title: "title",
      slug: "slug.current",
    },
    prepare: ({ displayTitle, title, slug }) => ({
      title: displayTitle ?? title,
      subtitle: slug,
    }),
  },
  fields: [
    defineField({
      ...titleField,
      description:
        "The topic title. Will be used when the topic is displayed within the topic hierarchy (e.g. in the top-level navigation)",
    }),
    defineField({
      title: "Display Title",
      name: "displayTitle",
      type: "string",
      description:
        "A preferred display title. Will be used when topic is displayed outside the topic hierarchy (e.g. when used as a page heading)",
    }),
    slugField,
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description:
        "A short description for the category (may appear on the website)",
      validation: (rule) => rule.max(255),
    }),
    defineField({
      title: "Sub-Topics",
      description:
        "Select the Topics that will appear as children of this Topic",
      name: "subtopics",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
      validation: (rule) => [
        rule.unique(),
        rule.custom((subtopics, ctx) => {
          if (typeof subtopics === "undefined") {
            return true;
          }

          return subtopics.some((st) =>
            ctx.document?._id.includes((st as any)._ref)
          )
            ? "A Topic cannot be a Subtopic of itself"
            : true;
        }),
      ],
    }),
    defineField({
      name: "image",
      title: "Category Cover Image",
      type: "accessibleImage",
      description: "A cover image to associate with this category",
    }),
    featuredResourcesField("article"),
    featuredResourcesField("story"),
  ],
});
