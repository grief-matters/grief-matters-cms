import { defineArrayMember, defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";
import { featuredResourcesField, slugField, titleField } from "../fields";
import { INTERNET_RESOURCE_TYPES } from "../../constants";

export default defineType({
  name: "category",
  title: "Category",
  description: `A category used to classify resources. Not to be used with "Topics" which is a specific 'category' itself`,
  icon: TagsIcon,
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
    slugField,
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description:
        "A short description for the category (may appear on the website)",
      validation: (rule) => rule.max(255),
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
            ctx.document?._id.includes((st as any)._ref)
          )
            ? "A Category cannot be a Subcategory of itself"
            : true;
        }),
      ],
    }),
    defineField({
      name: "image",
      title: "Category Cover Image",
      type: "accessibleImage",
      description: "A cover image to associate with this category",
    }),
    defineField({
      name: "featuredResources",
      title: "Featured Resources",
      type: "array",
      description: "Select a maximum of 3 Featured Resources in this category.",
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
        Rule.custom(async (resources, context) => {
          if (typeof resources === "undefined" || resources.length < 1) {
            return true;
          }

          const queryParts = resources.map((r: any) => `_id == "${r._ref}"`);
          const query = `*[${queryParts.join(" || ")}]`;

          const client = context.getClient({
            apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
          });

          try {
            const docs = await client.fetch(query);

            if (Array.isArray(docs)) {
              const resourcesWithoutImages = docs
                .filter((doc) => typeof doc?.image?.asset === "undefined")
                .map((doc) => doc.title.substring(0, 15) + "...");

              return resourcesWithoutImages.length > 0
                ? `"${resourcesWithoutImages.join(
                    `", "`
                  )}" do not have Images - fallbacks will be used`
                : true;
            }

            return true;
          } catch (error) {
            return "Error validating this field";
          }
        }).warning(),
      ],
    }),
    defineField({
      ...featuredResourcesField("article"),
      deprecated: {
        reason:
          "Deprecated as part of site redesign. Use Featured Resources instead.",
      },
    }),
    defineField({
      ...featuredResourcesField("story"),
      deprecated: {
        reason:
          "Deprecated as part of site redesign. Use Featured Resources instead.",
      },
    }),
  ],
});
