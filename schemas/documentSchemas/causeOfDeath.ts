import { defineField, defineType } from "sanity";
import { WarningOutlineIcon } from "@sanity/icons";

import { portableTextDescriptionField, slugField, titleField } from "../fields";
import {
  featuredResourcesArrayField,
  secondaryFeaturedResourcesArrayField,
} from "../fields/taxonomyFeaturedResourcesFields";

export default defineType({
  name: "causeOfDeath",
  title: "Cause of Death",
  description:
    "The cause of a death that has been experienced (e.g. suicide, cancer, sudden / traumatic).",
  icon: WarningOutlineIcon,
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
        "The cause of death title. Used when this taxonomy is referenced in lists and navigation.",
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
        "A longer description for this cause of death (will appear on its page as lead-in text).",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "accessibleImage",
      description: "A cover image to associate with this cause of death.",
    }),
    featuredResourcesArrayField({ tagFieldName: "causesOfDeath" }),
    secondaryFeaturedResourcesArrayField({ tagFieldName: "causesOfDeath" }),
  ],
});
