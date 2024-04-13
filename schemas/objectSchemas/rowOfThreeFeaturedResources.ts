import { defineArrayMember, defineField, defineType } from "sanity";
import { INTERNET_RESOURCE_TYPES } from "../../constants";
import { featuredResourceLinksPreviewConfig } from "../../configs/featuredResourceLinksPreviewConfig";

export default defineType({
  type: "object",
  name: "rowOfThreeFeaturedResources",
  description: "Selected resources will be shown with their images",
  preview: featuredResourceLinksPreviewConfig,
  title: "Row of 3 Featured Resources",
  fields: [
    defineField({
      name: "resources",
      title: "Resources",
      description:
        "Select individual internet resources of any type to appear in this collection",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [...INTERNET_RESOURCE_TYPES.map((t) => ({ type: t }))],
        }),
      ],
      validation: (Rule) => Rule.length(3),
    }),
  ],
});
