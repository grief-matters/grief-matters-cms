import { BottleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import demographicsField from "../fields/demographicsField";
import freeRegistrationField from "../fields/freeRegistrationField";
import imageAssetField from "../fields/imageAssetField";
import languagesField from "../fields/languagesField";
import paywallField from "../fields/paywallField";
import requiredSimpleDescriptionField from "../fields/requiredSimpleDescriptionField";
import searchAliasesField from "../fields/searchAliasesField";
import skipLinkCheckReasonField from "../fields/skipLinkCheckReasonField";
import skipLinkFetchField from "../fields/skipLinkFetchField";
import themesField from "../fields/themesField";
import titleField from "../fields/titleField";
import urlField from "../fields/urlField";
import sourceOrgField from "../fields/sourceOrgField";

export default defineType({
  type: "document",
  name: "essentialService",
  title: "Essential Service",
  icon: BottleIcon,
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
      ...urlField,
    }),
    defineField({
      group: "attributes",
      ...sourceOrgField,
    }),
    defineField({
      group: "attributes",
      type: "array",
      name: "contactMethods",
      title: "Contact Methods",
      of: [
        defineArrayMember({
          type: "contactMethod",
        }),
      ],
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
      ...skipLinkCheckReasonField,
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
      ...themesField,
    }),
    demographicsField,
    defineField({
      group: "search",
      ...searchAliasesField,
    }),
  ],
});
