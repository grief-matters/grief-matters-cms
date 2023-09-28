import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

import {
  categoriesField,
  populationsField,
  ratingField,
  readyForReviewField,
  requiredUrlField,
  simpleDescriptionField,
  titleField,
  websiteReferenceField,
} from "../fields";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";

export default defineType({
  type: "document",
  name: "story",
  title: "Story",
  icon: DocumentTextIcon,
  preview: reviewableDocumentPreviewConfig,
  fields: [
    titleField,
    simpleDescriptionField,
    requiredUrlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    defineField({
      title: "Photograph",
      name: "photo",
      type: "accessibleImage",
    }),
    ratingField,
    readyForReviewField,
  ],
});
