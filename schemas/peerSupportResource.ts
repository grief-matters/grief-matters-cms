import { defineField, defineType } from "sanity";
import { internetResourcePreviewConfig } from "../configs/internetResourcePreviewConfig";

const supportTypes = ["One-to-one", "Support group"];

const formats = ["In person", "Virtual"];

export default defineType({
  name: "peerSupportResource",
  type: "document",
  title: "Peer Support Resource",
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
      title: "Type",
      name: "type",
      type: "string",
      options: {
        list: supportTypes,
      },
    }),
    defineField({
      title: "Format",
      name: "format",
      type: "string",
      options: {
        list: formats,
      },
    }),
  ],
});
