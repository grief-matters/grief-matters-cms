import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "lossRelationships",
  title: "Loss Relationships",
  type: "array",
  description:
    "The relationship(s) to the person, being, or aspect of self that has been lost (e.g. parent, spouse, pet).",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "lossRelationship" }],
    }),
  ],
  validation: (Rule) => [
    Rule.unique(),
    Rule.max(2).warning(
      "Most resources relate to a single relationship; consider trimming.",
    ),
  ],
});
