import { defineField } from "sanity";

export default defineField({
  title: "Title",
  name: "title",
  type: "string",
  description: "Descriptive title for the resource.",
  validation: (Rule) => [
    Rule.required(),
    Rule.max(60).warning("Shorter titles are better for users"),
  ],
});
