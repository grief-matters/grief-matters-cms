import { defineField, defineType } from "sanity";

export default defineType({
  type: "object",
  name: "featuredWebsite",
  description: "Highlight a specific website to be shown on its own",
  title: "Featured Website",
  fields: [
    defineField({
      name: "resource",
      title: "Website",
      description: "Select the specific Website to be highlighted",
      type: "reference",
      to: [{ type: "website" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "boolean",
      name: "showLogo",
      title: "Show Logo",
      description: "Whether or not to show the website's logo (if it has one)",
      initialValue: false,
    }),
  ],
});
