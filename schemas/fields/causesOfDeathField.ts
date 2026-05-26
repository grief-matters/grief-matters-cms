import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "causesOfDeath",
  title: "Causes of Death",
  type: "array",
  description:
    "The cause(s) of death that this resource speaks to (e.g. suicide, cancer, sudden / traumatic).",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "causeOfDeath" }],
    }),
  ],
  validation: (Rule) => [
    Rule.unique(),
    Rule.max(2).warning(
      "Most resources relate to a single cause of death; consider trimming.",
    ),
  ],
});
