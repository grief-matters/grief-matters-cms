import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons";

import { internetResourcePreviewConfig } from "../../configs/internetResourcePreviewConfig";
import { validateImportField } from "../fields";

export default defineType({
  type: "document",
  name: "podcastEpisode",
  title: "Podcast Episode",
  icon: PlayIcon,
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
    validateImportField,
  ],
});
