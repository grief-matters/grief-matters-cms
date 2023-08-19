import { defineField, defineType } from "sanity";
import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";

export default defineType({
  name: "podcastEpisode",
  type: "document",
  title: "Podcast Episode",
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
      title: "Podcast",
      name: "parentPodcast",
      type: "reference",
      to: [{ type: "podcast" }],
    }),
  ],
});
