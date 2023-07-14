import { defineField, defineType } from "sanity";

export default defineType({
  name: "therapyResource",
  type: "document",
  title: "Therapy Resource",
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
  ],
});
