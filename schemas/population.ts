import { defineField, defineType } from "sanity";

export default defineType({
  title: "Population",
  name: "population",
  type: "document",
  fields: [
    defineField({
      title: "Population Name",
      name: "name",
      type: "string",
    }),
    defineField({
      title: "Description",
      name: "description",
      type: "text",
    }),
    defineField({
      name: "underserved",
      title: "Underserved",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
