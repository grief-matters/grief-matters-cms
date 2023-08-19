import { defineField, defineType } from "sanity";
import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";

export default defineType({
  title: "Website",
  name: "website",
  type: "document",
  preview: internetResourcePreviewConfig,
  initialValue: {
    validated: "false",
  },
  fields: [
    defineField({
      title: "Website Name",
      name: "name",
      type: "string",
    }),
    defineField({
      title: "Description",
      name: "description",
      type: "text",
    }),
    defineField({
      title: "URL",
      name: "websiteUrl",
      type: "url",
    }),
    defineField({
      title: "Logo",
      name: "logo",
      type: "logo",
    }),
  ],
});
