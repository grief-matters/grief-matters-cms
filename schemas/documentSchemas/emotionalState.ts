import { defineField, defineType } from "sanity";
import { SparkleIcon } from "@sanity/icons";
import slugField from "../fields/slugField";
import tagSearchAliasesField from "../fields/tagSearchAliasesField";

export default defineType({
  name: "emotionalState",
  title: "Emotional State",
  icon: SparkleIcon,
  type: "document",
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title,
      subtitle: `Emotion`,
    }),
  },
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
      validation: (rule) => [
        rule.required(),
        rule.max(255).warning("This description is a bit long"),
      ],
    }),
    tagSearchAliasesField,
  ],
});
