import type { ComponentType, ReactNode } from "react";
import { defineField, defineType } from "sanity";

import causesOfDeathField from "./fields/causesOfDeathField";
import contentFunctionsField from "./fields/contentFunctionsField";
import freeRegistrationField from "./fields/freeRegistrationField";
import griefPhasesField from "./fields/griefPhasesField";
import imageAssetField from "./fields/imageAssetField";
import lossRelationshipsField from "./fields/lossRelationshipsField";
import paywallField from "./fields/paywallField";
import searchAliasesField from "./fields/searchAliasesField";
import skipLinkFetchField from "./fields/skipLinkFetchField";
import skipLinkCheckReasonField from "./fields/skipLinkCheckReasonField";
import titleField from "./fields/titleField";
import emotionalStatesField from "./fields/emotionalStatesField";
import flaggedForAiReviewField from "./fields/flaggedForAiReviewField";
import urlField, { requiredUrlField } from "./fields/urlField";
import requiredSimpleDescriptionField from "./fields/requiredSimpleDescriptionField";
import themesField from "./fields/themesField";
import sourceOrgField from "./fields/sourceOrgField";
import languagesField from "./fields/languagesField";
import demographicsField from "./fields/demographicsField";
import audienceRoleFieldDef from "./fields/audienceRoleField";
import supportedGrieverFieldDef from "./fields/supportedGrieverField";
import griefTypesField from "./fields/griefTypesField";

export type CreateBaseInternetResourceParams = {
  name: string;
  title: string;
  isUrlRequired?: boolean;
  includeSource?: boolean;
  includeAudienceRole?: boolean;
  icon?: ComponentType | ReactNode;
};

export const createBaseInternetResourceSchema = ({
  isUrlRequired = true,
  includeSource = true,
  includeAudienceRole = true,
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

  const supportedGrieverField = includeAudienceRole
    ? defineField({
        group: "classification",
        ...supportedGrieverFieldDef,
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
      {
        name: "ai",
        title: "AI",
      },
    ],
    fields: [
      defineField({
        group: "ai",
        name: "aiAuditStamp",
        title: "Ai Audit Stamp",
        description:
          "Hidden field used to bump `updatedAt` field when touched by AI",
        type: "string",
        hidden: true,
      }),
      defineField({
        group: "attributes",
        ...titleField,
      }),
      defineField({
        group: "attributes",
        ...requiredSimpleDescriptionField,
      }),
      defineField({
        group: "attributes",
        ...urlF,
      }),
      sourceField,
      defineField({
        group: "attributes",
        ...imageAssetField,
      }),
      languagesField,
      defineField({
        group: "ai",
        ...skipLinkFetchField,
      }),
      defineField({
        group: "ai",
        ...skipLinkCheckReasonField,
      }),
      defineField({
        group: "ai",
        ...flaggedForAiReviewField,
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
        group: "classification",
        ...themesField,
      }),
      demographicsField,
      audienceRoleField,
      supportedGrieverField,
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
