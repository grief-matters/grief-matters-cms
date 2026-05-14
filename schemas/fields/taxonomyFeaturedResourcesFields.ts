import { defineArrayMember, defineField } from "sanity";

import { INTERNET_RESOURCE_TYPES } from "../../constants";

type Params = {
  tagFieldName: string;
};

const buildPickerFilter =
  (tagFieldName: string) => (resolverCtx: { document: { _id?: string } }) => {
    const { document } = resolverCtx;
    if (!document._id) {
      return { filter: undefined, params: undefined };
    }
    const idParam = document._id.replace("drafts.", "");
    return {
      filter: `$id in ${tagFieldName}[]._ref`,
      params: { id: idParam },
    };
  };

export const featuredResourcesArrayField = ({ tagFieldName }: Params) =>
  defineField({
    name: "featuredResources",
    title: "Featured Resources",
    type: "array",
    description:
      "Select a maximum of 3 Featured Resources. These will be displayed as the most prominent resources on the page.",
    of: [
      defineArrayMember({
        type: "reference",
        to: INTERNET_RESOURCE_TYPES.map((resourceType) => ({
          type: resourceType,
        })),
        options: {
          filter: buildPickerFilter(tagFieldName),
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
              .filter((doc) => typeof doc?.image?.asset === "undefined")
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
  });

export const secondaryFeaturedResourcesArrayField = ({
  tagFieldName,
}: Params) =>
  defineField({
    name: "secondaryFeaturedResources",
    title: "Secondary Featured Resources",
    type: "array",
    description:
      "Select a maximum of 10 Secondary Featured Resources. These will likely be shown without images.",
    of: [
      defineArrayMember({
        type: "reference",
        to: INTERNET_RESOURCE_TYPES.map((resourceType) => ({
          type: resourceType,
        })),
        options: {
          filter: buildPickerFilter(tagFieldName),
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
  });
