import { defineField, defineType } from "sanity";
import { internetResourcePreviewConfig } from "../configs/internetResourcePreviewConfig";

export default defineType({
  name: "app",
  type: "document",
  title: "App",
  preview: internetResourcePreviewConfig,
  initialValue: {
    validated: "false",
  },
  fields: [
    defineField({
      title: "Name",
      name: "name",
      type: "string",
    }),
    defineField({
      title: "Description",
      name: "description",
      type: "text",
    }),
    defineField({
      title: "Resource Details",
      name: "resourceDetails",
      type: "resourceBase",
    }),
    defineField({
      title: "Apple App Store",
      name: "appleUrl",
      type: "url",
    }),
    defineField({
      title: "Play Store",
      name: "playStoreUrl",
      type: "url",
    }),
  ],
});
