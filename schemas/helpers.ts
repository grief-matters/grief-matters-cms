import type { ComponentType, ReactNode } from "react";
import { defineField, defineType } from "sanity";

import audiencesField from "./fields/audiencesField";
import causesOfDeathField from "./fields/causesOfDeathField";
import contentFunctionsField from "./fields/contentFunctionsField";
import freeRegistrationField from "./fields/freeRegistrationField";
import griefPhasesField from "./fields/griefPhasesField";
import imageAssetField from "./fields/imageAssetField";
import lossRelationshipsField from "./fields/lossRelationshipsField";
import paywallField from "./fields/paywallField";
import searchAliasesField from "./fields/searchAliasesField";
import simpleDescriptionField from "./fields/simpleDescriptionField";
import skipLinkFetchField from "./fields/skipLinkFetchField";
import titleField from "./fields/titleField";
import tonesField from "./fields/tonesField";
import topicsField from "./fields/topicsField";
import urlField, { requiredUrlField } from "./fields/urlField";
import websiteReferenceField from "./fields/websiteReferenceField";

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
        ...imageAssetField,
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
    ],
  });
};
