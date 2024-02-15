import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Home Page",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "accessibleImage",
    }),
    defineField({
      name: "featurePanels",
      title: "Feature Panels",
      type: "array",
      of: [{ type: "reference", to: [{ type: "featuredContent" }] }],
      validation: (Rule) => Rule.required(),
    }),
  ],
});
