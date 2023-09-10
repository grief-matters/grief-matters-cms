import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

import {
  categoriesField,
  populationsField,
  readyForReviewField,
  requiredUrlField,
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
    defineField({
      title: "Description",
      name: "description",
      type: "text",
    }),
    requiredUrlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    defineField({
      title: "Photograph",
      name: "photo",
      type: "accessibleImage",
    }),
    readyForReviewField,
  ],
});
