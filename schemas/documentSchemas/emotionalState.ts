import { defineField, defineType } from "sanity";
import { SparkleIcon } from "@sanity/icons";
import slugField from "../fields/slugField";
import tagSearchAliasesField from "../fields/tagSearchAliasesField";

export default defineType({
  name: "emotionalState",
  title: "Emotional State",
  icon: SparkleIcon,
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
      type: "text",
    }),
    tagSearchAliasesField,
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
