import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "tones",
  title: "Tones",
  type: "array",
  description:
    "The emotional register or resonance of the resource (e.g. Grounding, Validating, Activating).",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "tone" }],
    }),
  ],
  validation: (Rule) => [
    Rule.unique(),
    Rule.max(3).warning("Tone is best kept to 1-3."),
  ],
});
