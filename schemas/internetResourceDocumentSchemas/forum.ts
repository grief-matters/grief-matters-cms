import { defineField, defineType } from "sanity";
import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";

export default defineType({
  name: "forum",
  type: "document",
  title: "Forum",
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
      type: "string",
    }),
    defineField({
      title: "Resource Details",
      name: "resourceDetails",
      type: "resourceBase",
    }),
  ],
});
