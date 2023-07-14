import { defineField, defineType } from "sanity";

export default defineType({
  name: "app",
  type: "document",
  title: "App",
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
      title: "Apple App Store",
      name: "appleUrl",
      type: "url",
    }),
    defineField({
      title: "Play Store",
      name: "playStoreUrl",
      type: "url",
    }),
  ],
});
