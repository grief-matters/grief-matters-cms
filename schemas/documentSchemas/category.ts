import { defineArrayMember, defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";

import { portableTextDescriptionField, slugField, titleField } from "../fields";
import { INTERNET_RESOURCE_TYPES } from "../../constants";

export default defineType({
  name: "category",
  title: "Category",
  description: `A category used to classify resources. Not to be confused with "Topics" which is a specific 'category' itself`,
  icon: TagsIcon,
  type: "document",
  deprecated: {
    reason:
      "Being decomposed into Loss Relationship, Cause of Death, and Topic taxonomies. Do not create new categories. Existing categories will be migrated and this type removed in a later phase.",
  },
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
        "The category title. Will be used when the category is displayed within the category hierarchy (e.g. in the top-level navigation)",
    }),
    defineField({
      title: "Display Title",
      name: "displayTitle",
      type: "string",
      description:
        "A preferred display title. Will be used when category is displayed outside the category hierarchy (e.g. when used as a page heading)",
    }),
    defineField({
      title: "Short Description",
      name: "shortDescription",
      type: "text",
      description: `This is a short description for the category that will usually appear close to the header. Keep it short and punchy!`,
      validation: (Rule) => [
        Rule.max(255).warning(
          `This description is a bit too long. Use the main "Description" field for a longer explanation of what this category contains.`
        ),
        Rule.max(1024).error(`Description longer than allowed length`),
      ],
    }),
    defineField({
      ...portableTextDescriptionField,
      description:
        "A longer description for the category (will appear on the category page as lead-in text)",
    }),
    defineField({
      title: "Sub-Categories",
      description:
        "Select the Categories that will appear as children of this Category",
      name: "subtopics",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
      validation: (rule) => [
        rule.unique(),
        rule.custom((subcategories, ctx) => {
          if (typeof subcategories === "undefined") {
            return true;
          }

          return subcategories.some((st) =>
            ctx.document?._id.includes((st as { _ref: string })._ref)
          )
            ? "A Category cannot be a Subcategory of itself"
            : true;
        }),
      ],
    }),
    defineField({
      name: "imageRef",
      title: "Category Cover Image",
      type: "reference",
      to: [{ type: "imageAsset" }],
      description: "A cover image to associate with this category",
    }),
    defineField({
      name: "featuredResources",
      title: "Featured Resources",
      type: "array",
      description:
        "Select a maximum of 3 Featured Resources in this category. These will be displayed as the most prominent resources on the page.",
      of: [
        defineArrayMember({
          type: "reference",
          to: INTERNET_RESOURCE_TYPES.map((resourceType) => ({
            type: resourceType,
          })),
          options: {
            filter: (resolverCtx) => {
              const { document } = resolverCtx;
              if (!document._id) {
                return { filter: undefined, params: undefined };
              }
              const idParam = document._id.replace("drafts.", "");
              return {
                filter: "$id in categories[]._ref",
                params: { id: idParam },
              };
            },
          },
        }),
      ],
      validation: (Rule) => [
        Rule.max(3),
        Rule.unique(),
        Rule.custom((resources, context) => {
          if (typeof resources === "undefined" || resources.length < 1) {
            return true;
          }

          const secondary =
            (context.document?.secondaryFeaturedResources as
              | { _ref: string }[]
              | undefined) ?? [];
          const secondaryRefs = new Set(secondary.map((r) => r._ref));
          const overlap = (resources as { _ref: string }[]).filter((r) =>
            secondaryRefs.has(r._ref)
          );

          return overlap.length > 0
            ? "Resources cannot appear in both Featured and Secondary Featured Resources"
            : true;
        }),
        Rule.custom(async (resources, context) => {
          if (typeof resources === "undefined" || resources.length < 1) {
            return true;
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const queryParts = resources.map((r: any) => `_id == "${r._ref}"`);
          const query = `*[${queryParts.join(" || ")}]`;

          const client = context.getClient({
            apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
          });

          try {
            const docs = await client.fetch(query);

            if (Array.isArray(docs)) {
              const resourcesWithoutImages = docs
                .filter((doc) => typeof doc?.imageRef?._ref === "undefined")
                .map((doc) => doc.title.substring(0, 15) + "...");

              return resourcesWithoutImages.length > 0
                ? `"${resourcesWithoutImages.join(
                    `", "`
                  )}" do not have Images - fallbacks will be used`
                : true;
            }

            return true;
          } catch (_error) {
            return "Error validating this field";
          }
        }).warning(),
      ],
    }),
    defineField({
      name: "secondaryFeaturedResources",
      title: "Secondary Featured Resources",
      type: "array",
      description:
        "Select a maximum of 10 Secondary Featured Resources in this category. These will likely be shown without images.",
      of: [
        defineArrayMember({
          type: "reference",
          to: INTERNET_RESOURCE_TYPES.map((resourceType) => ({
            type: resourceType,
          })),
          options: {
            filter: (resolverCtx) => {
              const { document } = resolverCtx;
              if (!document._id) {
                return { filter: undefined, params: undefined };
              }
              const idParam = document._id.replace("drafts.", "");
              return {
                filter: "$id in categories[]._ref",
                params: { id: idParam },
              };
            },
          },
        }),
      ],
      validation: (Rule) => [
        Rule.max(10),
        Rule.unique(),
        Rule.custom((resources, context) => {
          if (typeof resources === "undefined" || resources.length < 1) {
            return true;
          }

          const featured =
            (context.document?.featuredResources as
              | { _ref: string }[]
              | undefined) ?? [];
          const featuredRefs = new Set(featured.map((r) => r._ref));
          const overlap = (resources as { _ref: string }[]).filter((r) =>
            featuredRefs.has(r._ref)
          );

          return overlap.length > 0
            ? "Resources cannot appear in both Featured and Secondary Featured Resources"
            : true;
        }),
      ],
    }),
  ],
});
