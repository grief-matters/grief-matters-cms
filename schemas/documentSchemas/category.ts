import { defineArrayMember, defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";
import { featuredResourcesField, slugField, titleField } from "../fields";
import { INTERNET_RESOURCE_TYPES } from "../../constants";

export default defineType({
  name: "category",
  title: "Topic",
  description: "A category used to classify resources",
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
        "The topic title. Will be used when the topic is displayed within the topic hierarchy (e.g. in the top-level navigation)",
    }),
    defineField({
      title: "Display Title",
      name: "displayTitle",
      type: "string",
      description:
        "A preferred display title. Will be used when topic is displayed outside the topic hierarchy (e.g. when used as a page heading)",
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
      title: "Sub-Topics",
      description:
        "Select the Topics that will appear as children of this Topic",
      name: "subtopics",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
      validation: (rule) => [
        rule.unique(),
        rule.custom((subtopics, ctx) => {
          if (typeof subtopics === "undefined") {
            return true;
          }

          return subtopics.some((st) =>
            ctx.document?._id.includes((st as any)._ref)
          )
            ? "A Topic cannot be a Subtopic of itself"
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
      of: INTERNET_RESOURCE_TYPES.map((resourceType) =>
        defineArrayMember({
          name: resourceType,
          type: "reference",
          to: [{ type: resourceType }],
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
        })
      ),
      validation: (Rule) => [
        Rule.max(3),
        Rule.unique(),
        Rule.custom(async (resources, context) => {
          if (typeof resources === "undefined" || resources.length < 1) {
            return true;
          }

          const queryParts = resources.map((r: any) => `_id == "${r._ref}"`);
          const query = `*[${queryParts.join(" || ")}]`;
          console.log(query);

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
