import { defineArrayMember, defineField, defineType } from "sanity";
import { INTERNET_RESOURCE_TYPES } from "../../constants";
import { titleField } from "../fields";

export default defineType({
  type: "object",
  name: "resourceLinks",
  fields: [
    { ...titleField, description: "Descriptive name for this link collection" },
    defineField({
      name: "resources",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [...INTERNET_RESOURCE_TYPES.map((t) => ({ type: t }))],
        }),
      ],
    }),
  ],
});
