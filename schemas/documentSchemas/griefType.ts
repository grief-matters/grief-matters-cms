import { defineField, defineType } from "sanity";
import { ClockIcon } from "@sanity/icons";

import slugField from "../fields/slugField";
import tagSearchAliasesField from "../fields/tagSearchAliasesField";
import aiPromptHintField from "../fields/aiPromptHintField";

export default defineType({
  name: "griefType",
  title: "Grief Type",
  icon: ClockIcon,
  type: "document",
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title,
      subtitle: `Grief Type`,
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
        "A description for the type of grief that will be useful to editors when tagging resources",
      type: "text",
      validation: (rule) => [
        rule.required(),
        rule.max(255).warning("This description is a bit long"),
      ],
    }),
    tagSearchAliasesField,
  ],
});
