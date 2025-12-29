import { defineField } from "sanity";

export default defineField({
  title: "SEO Phrases",
  name: "seoPhrases",
  description: "A list of optimized phrases to be used in search and SEO",
  type: "array",
  of: [{ type: "string" }],
  validation: (rule) =>
    rule.max(10).warning("Too many phrases can dilute relevance."),
});
