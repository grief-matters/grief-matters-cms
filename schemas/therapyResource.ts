import { defineField, defineType } from "sanity";
import { internetResourcePreviewConfig } from "../configs/internetResourcePreviewConfig";

export default defineType({
  name: "therapyResource",
  type: "document",
  title: "Therapy Resource",
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
  ],
});
