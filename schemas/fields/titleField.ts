import { defineField } from "sanity";

export default defineField({
  title: "Title",
  name: "title",
  type: "string",
  description: "Descriptive title for the resource.",
  validation: (Rule) => [
    Rule.required(),
    Rule.max(80).warning(
      "Shorter titles are better for users. Can this title be shortened for readability?"
    ),
  ],
});
