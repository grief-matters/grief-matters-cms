import { defineField } from "sanity";

export default defineField({
  title: "Slug",
  name: "slug",
  type: "slug",
  options: {
    source: "title",
    slugify: (input) => input.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
  },
  validation: (Rule) => Rule.required(),
});
