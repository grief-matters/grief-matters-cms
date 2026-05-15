import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";
import {
  accessibleImageField,
  imageAssetField,
  slugField,
  tagSearchAliasesField,
} from "../fields";

export default defineType({
  name: "audience",
  title: "Audience",
  icon: TagsIcon,
  type: "document",
  fields: [
    defineField({
      title: "Audience Name",
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
    tagSearchAliasesField,
    defineField({
      name: "underserved",
      title: "Underserved",
      type: "boolean",
      initialValue: false,
    }),
    accessibleImageField,
    imageAssetField,
  ],
});
