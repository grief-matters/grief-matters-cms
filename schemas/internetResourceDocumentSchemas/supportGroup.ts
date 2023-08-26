import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";
import { supportFormats } from "./peerSupport";
import { validateImportField } from "../fields";

export default defineType({
  type: "document",
  name: "supportGroup",
  title: "Support Group",
  icon: UsersIcon,
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
    validateImportField,
  ],
});
