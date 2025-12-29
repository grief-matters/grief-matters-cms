import { defineField } from "sanity";

export default defineField({
  title: "Keywords",
  name: "keywords",
  description: "A list of keywords to be used in search and SEO",
  type: "array",
  of: [
    {
      type: "string",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;

          // Disallow spaces
          if (/\s/.test(value as string)) {
            return "Keywords cannot contain spaces. Use hyphens instead.";
          }

          return true;
        }),
    },
  ],
  validation: (rule) =>
    rule.unique().max(10).warning("Too many keywords can dilute relevance."),
  options: {
    layout: "tags",
  },
});
