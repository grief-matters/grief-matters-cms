import { defineField, defineType } from "sanity";

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "featurePanels",
      title: "Feature Panels",
      type: "array",
      of: [{ type: "reference", to: [{ type: "featurePanel" }] }],
    }),
  ],
});
