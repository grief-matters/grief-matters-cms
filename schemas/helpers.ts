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
import skipLinkFetchField from "./fields/skipLinkFetchField";
import titleField from "./fields/titleField";
import emotionalStatesField from "./fields/emotionalStatesField";
import topicsField from "./fields/topicsField";
import urlField, { requiredUrlField } from "./fields/urlField";
import websiteReferenceField from "./fields/websiteReferenceField";
import requiredSimpleDescriptionField from "./fields/requiredSimpleDescriptionField";
import themesField from "./fields/themesField";
import sourceOrgField from "./fields/sourceOrgField";
import languagesField from "./fields/languagesField";
import demographicsField from "./fields/demographicsField";
import audienceRoleFieldDef from "./fields/audienceRoleField";
import portableTextDescriptionField from "./fields/portableTextDescriptionField";
import griefTypesField from "./fields/griefTypesField";

export type CreateBaseInternetResourceParams = {
  name: string;
  title: string;
  isUrlRequired?: boolean;
  includeSource?: boolean;
  includeAudienceRole?: boolean;
  includeRichTextDescription?: boolean;
  icon?: ComponentType | ReactNode;
};

export const createBaseInternetResourceSchema = ({
  isUrlRequired = true,
  includeSource = true,
  includeAudienceRole = true,
  includeRichTextDescription = false,
  ...params
}: CreateBaseInternetResourceParams) => {
  const urlF = isUrlRequired ? requiredUrlField : urlField;

  const sourceField = includeSource
    ? defineField({
        group: "attributes",
        ...sourceOrgField,
      })
    : null;

  const audienceRoleField = includeAudienceRole
    ? defineField({
        group: "classification",
        ...audienceRoleFieldDef,
      })
    : null;

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
      {
        name: "access",
        title: "Access Restrictions",
      },
    ],
    fields: [
      defineField({
        group: "attributes",
        ...titleField,
      }),
      defineField({
        group: "attributes",
        ...(includeRichTextDescription
          ? portableTextDescriptionField
          : requiredSimpleDescriptionField),
      }),
      defineField({
        group: "attributes",
        ...urlF,
      }),
      sourceField,
      defineField({
        deprecated: { reason: "replaced by source org" },
        group: "attributes",
        ...websiteReferenceField,
      }),
      defineField({
        group: "attributes",
        ...imageAssetField,
      }),
      languagesField,
      defineField({
        group: "access",
        ...skipLinkFetchField,
      }),
      defineField({
        group: "access",
        ...paywallField,
      }),
      defineField({
        group: "access",
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
        deprecated: { reason: "replaced by themes" },
        group: "classification",
        ...topicsField,
      }),
      defineField({
        group: "classification",
        ...themesField,
      }),
      demographicsField,
      audienceRoleField,
      defineField({
        deprecated: {
          reason: "replaced by demographics",
        },
        group: "classification",
        ...audiencesField,
      }),
      defineField({
        group: "classification",
        ...griefPhasesField,
      }),
      defineField({
        group: "classification",
        ...griefTypesField,
      }),
      defineField({
        group: "classification",
        ...contentFunctionsField,
      }),
      defineField({
        group: "classification",
        ...emotionalStatesField,
      }),
      defineField({
        group: "search",
        ...searchAliasesField,
      }),
    ].filter((x) => x !== null),
  });
};
