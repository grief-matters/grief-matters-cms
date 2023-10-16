import { defineField, defineType } from "sanity";
import { portableTextDescriptionField, titleField } from "../fields";
import { INTERNET_RESOURCE_TYPES } from "../../constants";

export default defineType({
  name: "featurePanel",
  title: "Feature Panel",
  type: "document",
  fields: [
    titleField,
    portableTextDescriptionField,
    // repeatable and orderable?
    // resource links
    // images 'triple'
    // category links
    // see more link
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "rowOfThree" },
        { type: "categoryLinks" },
        { type: "resourceLinks" },
        {
          type: "object",
          name: "Rich Text Block",
          fields: [{ ...portableTextDescriptionField }],
        },
      ],
    }),
    defineField({
      name: "jumpLink",
      title: "Jump Link",
      description: `A link at the foot of the feature panel (usually a "see more..."`,
      type: "object",
      fields: [
        defineField({
          name: "linkType",
          type: "string",
          options: {
            list: [
              { value: "category", title: "Link to category" },
              { value: "resourceType", title: "Link to resource Type" },
              { value: "url", title: "URL" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "category",
          title: "Category",
          type: "reference",
          to: [{ type: "category" }],
          hidden: ({ parent }) => parent?.linkType !== "category",
        }),
        defineField({
          name: "resourceType",
          title: "ResourceType",
          type: "string",
          options: {
            list: [...INTERNET_RESOURCE_TYPES],
          },
          hidden: ({ parent }) => parent?.linkType !== "resourceType",
        }),
        defineField({
          name: "url",
          title: "URL",
          type: "url",
          hidden: ({ parent }) => parent?.linkType !== "url",
        }),
      ],
    }),
  ],
});
