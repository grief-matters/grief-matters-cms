import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";
import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";
import { validateImportField } from "../fields";
import ResourceUrlInput from "../../components/ResourceUrlInput";

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
      components: {
        input: ResourceUrlInput,
      },
    }),
    defineField({
      title: "Logo",
      name: "logo",
      type: "logo",
    }),
    validateImportField,
  ],
});
