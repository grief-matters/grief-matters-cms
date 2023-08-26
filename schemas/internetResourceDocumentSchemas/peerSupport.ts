import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";
import { validateImportField } from "../fields";

export const supportFormats = ["In person", "Virtual"];

export default defineType({
  type: "document",
  name: "peerSupport",
  title: "Peer Support",
  icon: UserIcon,
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
