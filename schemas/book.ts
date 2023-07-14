import { defineField, defineType } from "sanity";

export default defineType({
  name: "book",
  type: "document",
  title: "Book",
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
      title: "Author",
      name: "author",
      type: "string",
    }),
    defineField({
      title: "ISBN",
      name: "isbn",
      type: "string",
      validation: (rule) =>
        rule.min(10).max(13).error("An ISBN is 10 or 13 digits long"),
    }),
  ],
});
