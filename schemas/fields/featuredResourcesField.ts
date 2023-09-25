import pluralize from "pluralize";
import { defineField, defineArrayMember } from "sanity";
import { InternetResourceType } from "../../types";
import { startCase } from "lodash";

export default (resourceType: InternetResourceType) => {
  const r = startCase(pluralize(resourceType));

  return defineField({
    name: `featured${r}`,
    title: `Featured ${r}`,
    description: `Select a maximum of 3 "Featured ${r}" in this category.`,
    type: "array",
    of: [
      defineArrayMember({
        type: "reference",
        to: [{ type: resourceType }],
        options: {
          filter: ({ document }) => {
            if (!document._id) {
              return {
                filter: undefined,
                params: undefined,
              };
            }

            const idParam = document._id.replace("drafts.", "");

            return {
              filter: "$id in categories[]._ref",
              params: {
                id: idParam,
              },
            };
          },
          disableNew: true,
        },
      }),
    ],
    validation: (Rule) => [Rule.max(3), Rule.unique()],
  });
};
