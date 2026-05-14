import { defineField } from "sanity";
import { validateSearchAliases } from "./searchAliasesValidator";

export default defineField({
  title: "Search Aliases",
  name: "searchAliases",
  type: "array",
  description:
    "Words or phrases a user might type to find this resource that do not already appear in the title or description. Synonyms, alternate phrasings, common misspellings. Natural language — no hyphens.",
  of: [{ type: "string" }],
  options: {
    layout: "tags",
  },
  validation: (Rule) => [
    Rule.unique(),
    Rule.max(5).warning(
      "Aliases should be focused — more than 5 may dilute relevance."
    ),
    Rule.custom(validateSearchAliases).warning(),
  ],
});
