import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "featuredCrisisResource",
  description: "Highlight a specific Crisis Resource to be shown on its own",
  title: "Featured Crisis Resource",
  fields: [
    defineField({
      name: "resource",
      title: "Crisis Resource",
      description: "Select the specific Crisis Resource to be highlighted",
      type: "reference",
      to: [{ type: "crisisResource" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "boolean",
      name: "showImage",
      title: "Show Image",
      description:
        "Whether or not to show the resource's image (if it has one)",
      initialValue: false,
    }),
  ],
});
