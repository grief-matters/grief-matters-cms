import { defineField } from "sanity";

export default defineField({
  title: "Search Aliases",
  name: "searchAliases",
  type: "array",
  description:
    "Equivalent words a user might type when they mean this tag — synonyms, alternate phrasings. E.g. on 'Loss of a Sibling': sister, brother, kin. Natural language — no hyphens.",
  of: [{ type: "string" }],
  options: {
    layout: "tags",
  },
  validation: (Rule) => Rule.unique(),
});
