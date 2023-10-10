import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";
import { FilterOperatorField } from "../../components";
import { featuredResourcesField } from "../fields";

export default defineType({
  name: "smartCategory",
  title: "Smart Category",
  description: "A smart-category used to classify resources",
  icon: TagsIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "A custom label for the smart-category",
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Describes the purpose of this smart-category",
      type: "string",
    }),
    defineField({
      title: "Parent Category",
      description: `Select a parent category, if you want this smart-category to appear as a sub-category of a "regular" category (smart-categories themselves cannot be parents)`,
      name: "parent",
      type: "reference",
      to: [{ type: "category" }],
      options: { disableNew: true },
    }),
    defineField({
      name: "categories",
      title: "Categories",
      description:
        "Select the categories required to generate this smart-category",
      type: "array",
      of: [
        {
          type: "reference",
          options: { disableNew: true },
          to: [{ type: "category" }],
        },
      ],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "filterOperator",
      title: "Resource Filter",
      type: "string",
      initialValue: "or",
      options: {
        list: [
          { title: "OR", value: "or" },
          { title: "AND", value: "and" },
        ],
        layout: "radio",
      },
      components: {
        field: FilterOperatorField,
      },
    }),
    featuredResourcesField("article", true),
    featuredResourcesField("story", true),
  ],
});
