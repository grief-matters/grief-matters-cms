import { defineArrayMember, defineField } from "sanity";
import { INTERNET_RESOURCE_TYPES } from "../../constants";

export default defineField({
  name: "typeFilter",
  title: "Limit by resource type (applies to Categories only)",
  description:
    "If you want to limit this collection to resources of a specific type, select them below (if left empty all types will be retrieved)",
  type: "array",
  of: [
    defineArrayMember({
      type: "string",
    }),
  ],
  options: {
    list: [...INTERNET_RESOURCE_TYPES.map((irt) => irt)],
  },
});
