import { defineField, defineType } from "sanity";
import { internetResourcePreviewConfig } from "../configs/internetResourcePreviewConfig";

export default defineType({
  name: "podcast",
  type: "document",
  title: "Podcast",
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
      type: "url",
      name: "spotifyUrl",
      title: "Spotify",
    }),
    defineField({
      type: "url",
      name: "appleUrl",
      title: "Apple",
    }),
  ],
});
