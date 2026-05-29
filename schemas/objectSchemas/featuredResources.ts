import { defineArrayMember, defineField, defineType } from "sanity";
import { featuredResourceLinksPreviewConfig } from "../../configs/featuredResourceLinksPreviewConfig";
import { internetResourceTypes } from "../../shared/internet-resource";

export default defineType({
  type: "object",
  name: "featuredResources",
  description: "Selected resources will be shown with their images",
  preview: featuredResourceLinksPreviewConfig,
  title: "Featured Resources",
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
          to: [...internetResourceTypes.map((t) => ({ type: t }))],
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
});
