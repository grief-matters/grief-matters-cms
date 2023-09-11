import { defineArrayMember, defineField } from "sanity";
import { duplicateReferenceValidator } from "../fields";

export default defineField({
  name: "populations",
  title: "Populations",
  type: "array",
  description: "Specific population groups that this resource will apply to",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "population" }],
    }),
  ],
  validation: (Rule) =>
    /* @ts-ignore */
    Rule.custom(duplicateReferenceValidator),
});
