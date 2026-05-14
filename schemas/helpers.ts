import type { ComponentType, ReactNode } from "react";
import { defineField, defineType } from "sanity";
import {
  titleField,
  simpleDescriptionField,
  requiredUrlField,
  websiteReferenceField,
  categoriesField,
  lossRelationshipsField,
  causesOfDeathField,
  topicsField,
  audiencesField,
  griefPhasesField,
  contentFunctionsField,
  tonesField,
  ratingField,
  searchAliasesField,
  urlField,
  accessibleImageField,
} from "./fields";
import skipLinkFetchField from "./fields/skipLinkFetchField";
import freeRegistrationField from "./fields/freeRegistrationField";
import paywallField from "./fields/paywallField";

export type CreateBaseInternetResourceParams = {
  name: string;
  title: string;
  isUrlRequired: boolean;
  icon?: ComponentType | ReactNode;
};

export const createBaseInternetResourceSchema = (
  params: CreateBaseInternetResourceParams
) => {
  const urlF = params.isUrlRequired ? requiredUrlField : urlField;

  return defineType({
    type: "document",
    name: params.name,
    title: params.title,
    icon: params.icon,
    groups: [
      {
        name: "attributes",
        title: "Resource Attributes",
      },
      {
        name: "classification",
        title: "Classification",
      },
      {
        name: "search",
        title: "Search & SEO",
      },
    ],
    fields: [
      defineField({
        group: "attributes",
        ...titleField,
      }),
      defineField({
        group: "attributes",
        ...simpleDescriptionField,
      }),
      defineField({
        group: "attributes",
        ...urlF,
      }),
      defineField({
        group: "attributes",
        ...websiteReferenceField,
      }),
      defineField({
        group: "attributes",
        ...accessibleImageField,
      }),
      defineField({
        group: "attributes",
        ...skipLinkFetchField,
      }),
      defineField({
        group: "attributes",
        ...paywallField,
      }),
      defineField({
        group: "attributes",
        ...freeRegistrationField,
      }),
      defineField({
        group: "classification",
        ...categoriesField,
      }),
      defineField({
        group: "classification",
        ...lossRelationshipsField,
      }),
      defineField({
        group: "classification",
        ...causesOfDeathField,
      }),
      defineField({
        group: "classification",
        ...topicsField,
      }),
      defineField({
        group: "classification",
        ...audiencesField,
      }),
      defineField({
        group: "classification",
        ...griefPhasesField,
      }),
      defineField({
        group: "classification",
        ...contentFunctionsField,
      }),
      defineField({
        group: "classification",
        ...tonesField,
      }),

      defineField({
        group: "search",
        ...searchAliasesField,
      }),
      ratingField,
    ],
  });
};
