import { defineField, defineType } from "sanity";

export default defineType({
  name: "forum",
  type: "document",
  title: "Forum",
  fields: [
    defineField({
      title: "Name",
      name: "name",
      type: "string",
    }),
    defineField({
      title: "Description",
      name: "description",
      type: "string",
    }),
    defineField({
      title: "Resource Details",
      name: "resourceDetails",
      type: "resourceBase",
    }),
  ],
});
