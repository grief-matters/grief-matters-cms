import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";
import { validateImportField } from "../fields";

export default defineType({
  type: "document",
  name: "memorial",
  title: "Memorial",
  icon: DocumentIcon,
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
    validateImportField,
  ],
});
