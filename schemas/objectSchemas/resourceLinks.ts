import { defineArrayMember, defineField, defineType } from "sanity";
import { INTERNET_RESOURCE_TYPES } from "../../constants";
import { resourceLinksPreviewConfig } from "../../configs/resourceLinksPreviewConfig";

export default defineType({
  type: "object",
  name: "resourceLinks",
  preview: resourceLinksPreviewConfig,
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
    }),
  ],
});
