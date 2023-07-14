import { defineField, defineType } from "sanity";

export default defineType({
  name: "podcast",
  type: "document",
  title: "Podcast",
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
