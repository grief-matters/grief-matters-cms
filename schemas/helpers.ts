import type { ComponentType, ReactNode } from "react";
import { defineField, defineType } from "sanity";
import {
  titleField,
  simpleDescriptionField,
  requiredUrlField,
  websiteReferenceField,
  categoriesField,
  populationsField,
  ratingField,
  urlField,
  accessibleImageField,
} from "./fields";
import keywordsField from "./fields/keywordsField";
import seoPhrasesField from "./fields/seoPhrasesField";

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
        name: "search",
        title: "Search & SEO",
      },
    ],
    fields: [
      titleField,
      simpleDescriptionField,
      urlF,
      websiteReferenceField,
      categoriesField,
      populationsField,
      ratingField,
      accessibleImageField,
      defineField({
        group: "search",
        ...keywordsField,
      }),
      defineField({
        group: "search",
        ...seoPhrasesField,
      }),
    ],
  });
};
