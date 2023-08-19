import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";

export default defineType({
  type: "document",
  name: "story",
  title: "Story",
  icon: DocumentTextIcon,
  preview: internetResourcePreviewConfig,
  initialValue: {
    validated: "false",
  },
  fields: [
    defineField({
      title: "Title",
      name: "title",
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
      title: "Photograph",
      name: "photo",
      type: "accessibleImage",
    }),
  ],
});
