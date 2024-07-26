import { TagsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { simpleDescriptionField, titleField } from "../fields";

export default defineType({
  type: "document",
  name: "topicCollection",
  title: "Topic Collection",
  icon: TagsIcon,
  description:
    "A collection of topics outside of the usual hierarchical structure",
  fields: [
    titleField,
    simpleDescriptionField,
    defineField({
      name: "topics",
      title: "Topics",
      description: "Select the Topics you want to include in this collection",
      type: "array",
      of: [
        {
          type: "reference",
          options: { disableNew: true },
          to: [{ type: "category" }, { type: "smartCategory" }],
        },
      ],
      validation: (Rule) => Rule.unique(),
    }),
  ],
});
