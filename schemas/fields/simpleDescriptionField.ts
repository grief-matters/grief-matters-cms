import { defineField } from "sanity";

export default defineField({
  title: "Description",
  name: "description",
  type: "text",
  description: `A simple text description field. Avoid adding links and other 'Rich Text' elements.`,
  validation: (Rule) => [
    Rule.max(255).warning(
      `This description is a bit long. It might lose impact.`
    ),
    Rule.max(1024).error(`Description longer than allowed length`),
  ],
});
