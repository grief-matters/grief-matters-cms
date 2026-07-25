import { defineField, defineType } from "sanity";
import { SparkleIcon } from "@sanity/icons";
import slugField from "../fields/slugField";
import tagSearchAliasesField from "../fields/tagSearchAliasesField";
import aiPromptHintField from "../fields/aiPromptHintField";

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
    defineField({
      title: "Display Title",
      name: "displayTitle",
      type: "string",
      description:
        "A preferred display title. Used when displayed outside of lists (e.g. as a page heading).",
    }),
    slugField,
    aiPromptHintField,
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
