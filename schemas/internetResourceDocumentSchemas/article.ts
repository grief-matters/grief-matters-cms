import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";

export default defineType({
  type: "document",
  name: "article",
  title: "Article",
  icon: DocumentIcon,
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
      title: "Parent Blog",
      name: "parentBlog",
      type: "reference",
      to: [{ type: "blog" }],
    }),
    defineField({
      title: "Resource has been checked for errors",
      name: "validated",
      type: "boolean",
    }),
  ],
});