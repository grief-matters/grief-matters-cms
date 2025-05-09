import startCase from "lodash/startCase";

import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";

import { INTERNET_RESOURCE_TYPES } from "../../constants";
import { slugField } from "../fields";

export default defineType({
  name: "smartResourceCollection",
  title: "Smart Resource Collection",
  description:
    "Generate a collection of resources by selecting specific options",
  icon: TagsIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Title for Smart Resource Collection",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField,
    defineField({
      name: "image",
      title: "Smart Collection Cover Image",
      type: "accessibleImage",
      description:
        "A preferred image to de displayed alongside this Smart Collection",
    }),
    defineField({
      name: "categories",
      title: "Topics",
      description:
        "Select the Topics that you wish to include in this collection.",
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
      name: "populations",
      title: "Populations",
      description:
        "Select the populations that this collection should be filtered to. For example, if you select 'LGBTQ+ Community', only resources for that group will be included.",
      type: "array",
      of: [
        {
          type: "reference",
          options: { disableNew: true },
          to: [{ type: "population" }],
        },
      ],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "types",
      title: "Resource Types",
      description:
        "The types of resources that will be included in this collection",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          ...INTERNET_RESOURCE_TYPES.map((resourceType) => ({
            value: resourceType,
            title: startCase(resourceType),
          })),
          { value: "crisisResource", title: "Crisis Resource" },
          {
            value: "website",
            title: "Website",
          },
        ],
      },
    }),
    defineField({
      name: "shouldGenerateStaticPath",
      title: "Should Generate Page",
      description:
        "Ensures this Smart Collection will generate its own page. Disable only if intended to be shown as part of another Content Group.",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
