import { defineArrayMember, defineField, defineType } from "sanity";
import { INTERNET_RESOURCE_TYPES } from "../../constants";

export default defineType({
  title: "Custom Resource Collection",
  description: "A custom collection of specific resources or categories",
  name: "customResourceCollection",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Label",
      type: "string",
      description: "Provide a label for this resource collection.",
    }),
    defineField({
      name: "resources",
      title: "Categories or Resources",
      description:
        "You can select specific resources or entire categories to appear within this collection",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          description:
            "References to categories or specific internet resources",
          to: [
            { type: "category" },
            ...INTERNET_RESOURCE_TYPES.map((irt) => ({
              type: irt,
            })),
          ],
        }),
      ],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
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
    }),
  ],
});
