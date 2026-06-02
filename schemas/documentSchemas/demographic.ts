import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";

import imageAssetField from "../fields/imageAssetField";
import slugField from "../fields/slugField";
import tagSearchAliasesField from "../fields/tagSearchAliasesField";
import requiredSimpleDescriptionField from "../fields/requiredSimpleDescriptionField";
import aiPromptHintField from "../fields/aiPromptHintField";

export default defineType({
  name: "demographic",
  title: "Demographic",
  description:
    "A demographic describes a specific identity or community of people",
  icon: TagsIcon,
  type: "document",
  preview: {
    select: {
      title: "name",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: `Demographic`,
    }),
  },
  fields: [
    defineField({
      title: "Demographic Name",
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
    aiPromptHintField,
    requiredSimpleDescriptionField,
    tagSearchAliasesField,
    defineField({
      name: "underserved",
      title: "Underserved",
      type: "boolean",
      initialValue: false,
    }),
    imageAssetField,
  ],
});
