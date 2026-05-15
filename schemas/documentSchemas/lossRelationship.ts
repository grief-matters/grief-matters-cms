import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

import {
  portableTextDescriptionField,
  slugField,
  tagSearchAliasesField,
  titleField,
} from "../fields";
import {
  featuredResourcesArrayField,
  secondaryFeaturedResourcesArrayField,
} from "../fields/taxonomyFeaturedResourcesFields";

export default defineType({
  name: "lossRelationship",
  title: "Loss Relationship",
  description:
    "The relationship to the person, being, or aspect of self that has been lost (e.g. parent, spouse, pet).",
  icon: UsersIcon,
  type: "document",
  preview: {
    select: {
      displayTitle: "displayTitle",
      title: "title",
      slug: "slug.current",
    },
    prepare: ({ displayTitle, title, slug }) => ({
      title: displayTitle ?? title,
      subtitle: slug,
    }),
  },
  fields: [
    slugField,
    defineField({
      ...titleField,
      description:
        "The loss relationship title. Used when this taxonomy is referenced in lists and navigation.",
    }),
    defineField({
      title: "Display Title",
      name: "displayTitle",
      type: "string",
      description:
        "A preferred display title. Used when displayed outside of lists (e.g. as a page heading).",
    }),
    defineField({
      title: "Short Description",
      name: "shortDescription",
      type: "text",
      description:
        "A short description that usually appears close to the header. Keep it short and punchy!",
      validation: (Rule) => [
        Rule.max(255).warning(
          `This description is a bit too long. Use the main "Description" field for a longer explanation.`
        ),
        Rule.max(1024).error("Description longer than allowed length"),
      ],
    }),
    defineField({
      ...portableTextDescriptionField,
      description:
        "A longer description for this loss relationship (will appear on its page as lead-in text).",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "accessibleImage",
      description: "A cover image to associate with this loss relationship.",
      deprecated: {
        reason:
          "Replaced by coverImageRef (reference to an imageAsset document). Old data has been migrated; this field will be removed in a future release.",
      },
    }),
    defineField({
      name: "coverImageRef",
      title: "Cover Image",
      type: "reference",
      to: [{ type: "imageAsset" }],
      description: "A cover image to associate with this loss relationship.",
    }),
    tagSearchAliasesField,
    featuredResourcesArrayField({ tagFieldName: "lossRelationships" }),
    secondaryFeaturedResourcesArrayField({ tagFieldName: "lossRelationships" }),
  ],
});
