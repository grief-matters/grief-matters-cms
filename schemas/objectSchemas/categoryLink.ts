import { defineField, defineType } from "sanity";
import { typeFilterField } from "../fields";
import { INTERNET_RESOURCE_TYPES } from "../../constants";

export default defineType({
  name: "categoryLink",
  title: "Category Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Category Link Label",
      type: "string",
      description: "This is what users will see",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      description: "Category to link to",
      to: [{ type: "category" }],
    }),
    defineField({
      ...typeFilterField,
      title: "Filter Category by Type(s)",
      description:
        "Restrict this category link to only show resources of a certain type (if left unchecked, all will be retrieved)",
      options: {
        list: [...INTERNET_RESOURCE_TYPES.map((irt) => irt), "website"],
      },
    }),
  ],
});
