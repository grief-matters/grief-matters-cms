import { defineField } from "sanity";

export default defineField({
  title: "Title",
  name: "title",
  type: "string",
  description: "Descriptive title for the resource.",
  validation: (Rule) =>
    Rule.required()
      .max(60)
      .warning("Titles are used for headings, shorter titles are better"),
});
