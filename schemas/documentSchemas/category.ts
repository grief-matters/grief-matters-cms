import { defineArrayMember, defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";
import { featuredResourcesField, slugField, titleField } from "../fields";

export default defineType({
  name: "category",
  title: "Category",
  description: `A category used to classify resources. Not to be used with "Topics" which is a specific 'category' itself`,
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
        "The category title. Will be used when the category is displayed within the category hierarchy (e.g. in the top-level navigation)",
    }),
    defineField({
      title: "Display Title",
      name: "displayTitle",
      type: "string",
      description:
        "A preferred display title. Will be used when category is displayed outside the category hierarchy (e.g. when used as a page heading)",
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
      title: "Sub-Categories",
      description:
        "Select the Categories that will appear as children of this Category",
      name: "subtopics",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
      validation: (rule) => [
        rule.unique(),
        rule.custom((subcategories, ctx) => {
          if (typeof subcategories === "undefined") {
            return true;
          }

          return subcategories.some((st) =>
            ctx.document?._id.includes((st as any)._ref)
          )
            ? "A Category cannot be a Subcategory of itself"
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
