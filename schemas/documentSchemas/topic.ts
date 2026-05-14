import { defineField, defineType } from "sanity";
import { BookmarkIcon } from "@sanity/icons";

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

const maxTopicDepth = 3;

export default defineType({
  name: "topic",
  title: "Topic",
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
        "The topic title. Used when this taxonomy is referenced in lists and navigation.",
    }),
    defineField({
      title: "Display Title",
      name: "displayTitle",
      type: "string",
      description:
        "A preferred display title. Used when displayed outside of lists (e.g. as a page heading).",
    }),
    defineField({
      name: "parentTopic",
      title: "Parent Topic",
      type: "reference",
      description: `The broader topic this one falls under (e.g. 'guilt' has 'emotional responses to grief' as its parent). Topics form a strict tree with a maximum of ${maxTopicDepth} levels. If you're not seeing a topic in the list that you expect check the Topic tree in Management Tools`,
      to: [{ type: "topic" }],
      options: {
        filter: ({ document }) => {
          if (!document?._id) {
            return { filter: undefined, params: undefined };
          }
          const selfId = document._id.replace(/^drafts\./, "");
          return {
            filter:
              "_id != $selfId && !defined(parentTopic->parentTopic) && (!defined(parentTopic) || parentTopic._ref != $selfId)",
            params: { selfId },
          };
        },
      },
      validation: (Rule) => [
        Rule.custom(async (value, context) => {
          const ref = (value as { _ref?: string } | undefined)?._ref;
          if (!ref) {
            return true;
          }
          const selfId = context.document?._id?.replace(/^drafts\./, "");
          if (!selfId) {
            return true;
          }
          if (ref === selfId) {
            return "A topic cannot be its own parent";
          }

          const client = context.getClient({
            apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
          });
          const parentParentRef = await client.fetch<string | null>(
            `*[_id == $ref][0].parentTopic._ref`,
            { ref }
          );
          if (parentParentRef === selfId) {
            return "Cycle detected — this would make the topic its own ancestor";
          }
          return true;
        }),
        Rule.custom(async (value, context) => {
          const ref = (value as { _ref?: string } | undefined)?._ref;
          if (!ref) {
            return true;
          }
          const selfId = context.document?._id?.replace(/^drafts\./, "");
          if (!selfId) {
            return true;
          }

          const client = context.getClient({
            apiVersion: process.env.SANITY_STUDIO_API_VERSION!,
          });
          const { parentDepth, subtreeDepth } = await client.fetch<{
            parentDepth: number;
            subtreeDepth: number;
          }>(
            `{
              "parentDepth": select(
                defined(*[_id == $ref][0].parentTopic->parentTopic) => 2,
                defined(*[_id == $ref][0].parentTopic) => 1,
                0
              ),
              "subtreeDepth": select(
                count(*[_type == "topic" && parentTopic->parentTopic._ref == $selfId]) > 0 => 2,
                count(*[_type == "topic" && parentTopic._ref == $selfId]) > 0 => 1,
                0
              )
            }`,
            { ref, selfId }
          );

          const newOwnDepth = parentDepth + 1;
          if (newOwnDepth + subtreeDepth >= maxTopicDepth) {
            const subtreePhrase =
              subtreeDepth === 0
                ? "this topic has no descendants"
                : `this topic's subtree extends ${subtreeDepth} level${
                    subtreeDepth === 1 ? "" : "s"
                  } below`;
            return `Setting this parent would exceed the ${maxTopicDepth}-level depth cap (parent is at depth ${parentDepth}, ${subtreePhrase})`;
          }
          return true;
        }),
      ],
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
        "A longer description for this topic (will appear on its page as lead-in text).",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "accessibleImage",
      description: "A cover image to associate with this topic.",
    }),
    tagSearchAliasesField,
    featuredResourcesArrayField({ tagFieldName: "topics" }),
    secondaryFeaturedResourcesArrayField({ tagFieldName: "topics" }),
  ],
});
