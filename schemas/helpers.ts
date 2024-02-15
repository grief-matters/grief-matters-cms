import type { ComponentType, ReactNode } from "react";
import { defineType } from "sanity";
import {
  titleField,
  simpleDescriptionField,
  requiredUrlField,
  websiteReferenceField,
  categoriesField,
  populationsField,
  ratingField,
  readyForReviewField,
  urlField,
} from "./fields";

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
    fields: [
      titleField,
      simpleDescriptionField,
      urlF,
      websiteReferenceField,
      categoriesField,
      populationsField,
      ratingField,
      readyForReviewField,
    ],
  });
};
