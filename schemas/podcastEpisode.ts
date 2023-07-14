import { defineField, defineType } from "sanity";

export default defineType({
  name: "podcastEpisode",
  type: "document",
  title: "Podcast Episode",
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
