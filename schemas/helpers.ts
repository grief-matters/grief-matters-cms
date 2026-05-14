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
import keywordsField from "./fields/keywordsField";
import seoPhrasesField from "./fields/seoPhrasesField";
import skipLinkReportField from "./fields/skipLinkReportField";
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
        name: "classification",
        title: "Classification",
      },
      {
        name: "search",
        title: "Search & SEO",
      },
    ],
    fields: [
      titleField,
      simpleDescriptionField,
      urlF,
      websiteReferenceField,
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
      ratingField,
      accessibleImageField,
      defineField({
        group: "search",
        ...searchAliasesField,
      }),
      defineField({
        group: "search",
        ...keywordsField,
      }),
      defineField({
        group: "search",
        ...seoPhrasesField,
      }),
      freeRegistrationField,
      paywallField,
      skipLinkReportField,
    ],
  });
};
