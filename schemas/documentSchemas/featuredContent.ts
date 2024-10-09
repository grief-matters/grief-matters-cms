import { defineField, defineType } from "sanity";
import { portableTextDescriptionField, titleField } from "../fields";

export default defineType({
  name: "featuredContent",
  title: "Featured Content",
  type: "document",
  deprecated: {
    reason: "The 'Featured Content' type has been replaced by 'Content Groups'",
  },
  fields: [
    defineField({
      ...titleField,
      description: "A heading for the feature panel",
      validation: (Rule) => Rule.required(),
    }),
    portableTextDescriptionField,
    defineField({
      name: "content",
      title: "Content",
      description:
        "Create a block of featured content from predefined building blocks",
      type: "array",
      of: [
        { type: "rowOfThree" },
        { type: "richTextContentBlock" },
        { type: "rowOfThreeFeaturedResources" },
        { type: "resourceLinks" },
        { type: "resourcePageLinks" },
        { type: "topicCollectionContentBlock" },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredContentFooterLink",
      title: "Footer Link",
      description: "The link to be shown in the footer of the feature panel",
      type: "resourcePageLink",
      readOnly: (ctx) =>
        typeof ctx.document?.manualFeaturedContentFooterLink !== "undefined",
    }),
    defineField({
      name: "manualFeaturedContentFooterLink",
      title: "Footer Link (manually set)",
      description: "A footer link with a manually set path",
      type: "object",
      readOnly: (ctx) =>
        typeof ctx.document?.featuredContentFooterLink !== "undefined",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          description: "The text that a user will see",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "url",
          title: "Relative Path",
          description: "A relative path for the desired page",
          type: "url",
          validation: (Rule) => Rule.uri({ relativeOnly: true }),
        }),
      ],
    }),
  ],
  validation: (Rule) =>
    Rule.custom((fields) => {
      if (typeof fields === "undefined") {
        return true;
      }

      const tooManyFooterFields =
        typeof fields?.featuredContentFooterLink !== "undefined" &&
        typeof fields?.manualFeaturedContentFooterLink !== "undefined";

      return tooManyFooterFields
        ? "You can only have a single footer field"
        : true;
    }),
});
