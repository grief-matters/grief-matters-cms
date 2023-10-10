import pluralize from "pluralize";
import {
  defineField,
  defineArrayMember,
  ReferenceFilterResolverContext,
} from "sanity";
import { InternetResourceType } from "../../types";
import { startCase } from "lodash";

const defaultFilter = (resolverCtx: ReferenceFilterResolverContext) => {
  const { document } = resolverCtx;
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
};

const fromOwnCategoriesFilter = (
  resolverCtx: ReferenceFilterResolverContext
) => {
  const { document } = resolverCtx;
  if (!document.categories) {
    return {
      filter: undefined,
      params: undefined,
    };
  }

  const categories = document.categories as any;

  const queryString = categories
    .map((c: any) => `'${c._ref}' in categories[]._ref`)
    .join(" || ");

  return {
    filter: queryString,
  };
};

export default (
  resourceType: InternetResourceType,
  filterFromOwnCategories: boolean = false
) => {
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
          filter: filterFromOwnCategories
            ? fromOwnCategoriesFilter
            : defaultFilter,
        },
      }),
    ],
    validation: (Rule) => [Rule.max(3), Rule.unique()],
  });
};
