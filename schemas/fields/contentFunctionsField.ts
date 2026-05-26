import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "contentFunctions",
  title: "Content Functions",
  type: "array",
  description:
    "What the reader is trying to accomplish when this resource serves them well (e.g. Practical Help, Validation, Skill-Building).",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "contentFunction" }],
    }),
  ],
  validation: (Rule) => [
    Rule.unique(),
    Rule.max(3).warning(
      "Most resources serve 1-3 functions well; consider trimming.",
    ),
  ],
});
