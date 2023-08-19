import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";

export default defineType({
  name: "category",
  title: "Category",
  icon: TagsIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "description",
      type: "string",
    }),
    defineField({
      title: "Parent Category",
      name: "parent",
      type: "reference",
      to: [{ type: "category" }],
    }),
  ],
});
