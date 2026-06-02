import { defineField, defineType } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons";

import slugField from "../fields/slugField";
import tagSearchAliasesField from "../fields/tagSearchAliasesField";
import aiPromptHintField from "../fields/aiPromptHintField";

export default defineType({
  name: "contentFunction",
  title: "Content Function",
  icon: BulbOutlineIcon,
  type: "document",
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title,
      subtitle: `Content Function`,
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
    aiPromptHintField,
    defineField({
      title: "Description",
      name: "description",
      description:
        "What is the reader trying to accomplish when this resource serves them well?",
      type: "text",
      validation: (rule) => [
        rule.required(),
        rule.max(255).warning("This description is a bit long"),
      ],
    }),
    tagSearchAliasesField,
  ],
});
