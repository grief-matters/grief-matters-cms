import { defineArrayMember, defineField, defineType } from "sanity";
import { resourceLinksPreviewConfig } from "../../configs/resourceLinksPreviewConfig";
import { internetResourceTypes } from "../../shared/internet-resource";

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
          to: [...internetResourceTypes.map((t) => ({ type: t }))],
        }),
      ],
    }),
  ],
});
