import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";
import { slugField } from "../fields";

export default defineType({
  name: "population",
  title: "Population",
  icon: TagsIcon,
  type: "document",
  fields: [
    defineField({
      title: "Population Name",
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    {
      ...slugField,
      options: {
        source: "name",
      },
    },
    defineField({
      title: "Description",
      name: "description",
      type: "text",
    }),
    defineField({
      name: "underserved",
      title: "Underserved",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
