import { defineArrayMember, defineField } from "sanity";
import { internetResourceTypes } from "../../shared/internet-resource";

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
    list: [...internetResourceTypes.map((irt) => irt)],
  },
});
