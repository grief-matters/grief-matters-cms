import { defineField, defineType } from "sanity";
import { BookmarkIcon } from "@sanity/icons";

import {
  featuredResourcesArrayField,
  secondaryFeaturedResourcesArrayField,
} from "../fields/taxonomyFeaturedResourcesFields";
import portableTextDescriptionField from "../fields/portableTextDescriptionField";
import slugField from "../fields/slugField";
import tagSearchAliasesField from "../fields/tagSearchAliasesField";
import titleField from "../fields/titleField";

export default defineType({
  name: "theme",
  title: "Theme",
  description:
    "A subject matter or theme covered by a resource (e.g. anger, self-care, funerals & memorials).",
  icon: BookmarkIcon,
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
        "The theme title. Used when this taxonomy is referenced in lists and navigation.",
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
        Rule.required(),
        Rule.max(255).warning(
          `This description is a bit too long. Use the main "Description" field for a longer explanation.`
        ),
        Rule.max(1024).error("Description longer than allowed length"),
      ],
    }),
    defineField({
      ...portableTextDescriptionField,
      description:
        "A longer description for this theme (will appear on its page as lead-in text).",
    }),
    defineField({
      name: "coverImageRef",
      title: "Cover Image",
      type: "reference",
      to: [{ type: "imageAsset" }],
      description: "A cover image to associate with this theme.",
    }),
    tagSearchAliasesField,
    featuredResourcesArrayField({ tagFieldName: "themes" }),
    secondaryFeaturedResourcesArrayField({ tagFieldName: "themes" }),
  ],
});
