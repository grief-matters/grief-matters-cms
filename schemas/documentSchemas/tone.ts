import { defineField, defineType } from "sanity";
import { SparkleIcon } from "@sanity/icons";
import { slugField, tagSearchAliasesField } from "../fields";

export default defineType({
  name: "tone",
  title: "Tone",
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
      description: "The emotional register or resonance the resource conveys.",
      type: "text",
    }),
    tagSearchAliasesField,
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
