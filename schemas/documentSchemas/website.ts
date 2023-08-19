import { defineField, defineType } from "sanity";
import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";
import { EarthGlobeIcon } from "@sanity/icons";

export default defineType({
  name: "website",
  title: "Website",
  type: "document",
  icon: EarthGlobeIcon,
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
