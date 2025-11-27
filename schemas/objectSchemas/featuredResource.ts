import { defineField, defineType } from "sanity";
import { INTERNET_RESOURCE_TYPES } from "../../constants";

export default defineType({
  type: "object",
  name: "featuredResource",
  description: "Highlight a specific resource to be shown on its own",
  title: "Featured Resource",
  fields: [
    defineField({
      name: "resource",
      title: "Resource",
      description: "Select an individual internet resource of any type",
      type: "reference",
      to: [...INTERNET_RESOURCE_TYPES.map((t) => ({ type: t }))],
      validation: (rule) => rule.required(),
    }),
  ],
});
