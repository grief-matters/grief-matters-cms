import { defineField, defineType } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons";
import { slugField, tagSearchAliasesField } from "../fields";

export default defineType({
  name: "contentFunction",
  title: "Content Function",
  icon: BulbOutlineIcon,
  type: "document",
  fields: [
    defineField({
      title: "Title",
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField,
    defineField({
      title: "Description",
      name: "description",
      description:
        "Editor-facing guidance: what is the reader trying to accomplish when this resource serves them well?",
      type: "text",
    }),
    tagSearchAliasesField,
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
