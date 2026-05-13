import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "griefPhases",
  title: "Clinical Grief Phases",
  type: "array",
  description:
    "Phases of the grief arc that this resource speaks to (e.g. Acute Destabilization, Meaning Reconstruction). A resource may legitimately span several phases.",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "griefPhase" }],
    }),
  ],
  validation: (Rule) => Rule.unique(),
});
