import { defineField, defineType } from "sanity";
import { supportFormats } from "./peerSupport";
import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";

export default defineType({
  name: "supportGroup",
  type: "document",
  title: "Support Group",
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
      title: "Format",
      name: "format",
      type: "string",
      options: {
        list: supportFormats,
      },
    }),
  ],
});
