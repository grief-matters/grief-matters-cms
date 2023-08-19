import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";

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
    }),
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
