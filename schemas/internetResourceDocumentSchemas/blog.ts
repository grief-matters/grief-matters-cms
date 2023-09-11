import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

import {
  categoriesField,
  populationsField,
  readyForReviewField,
  titleField,
  requiredUrlField,
  websiteReferenceField,
  simpleDescriptionField,
} from "../fields";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";

export default defineType({
  type: "document",
  name: "blog",
  title: "Blog",
  icon: DocumentsIcon,
  preview: reviewableDocumentPreviewConfig,
  fields: [
    titleField,
    simpleDescriptionField,
    requiredUrlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    readyForReviewField,
  ],
});
