import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

import {
  categoriesField,
  populationsField,
  ratingField,
  readyForReviewField,
  requiredUrlField,
  simpleDescriptionField,
  websiteReferenceField,
} from "../fields";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";

export default defineType({
  type: "document",
  name: "memorial",
  title: "Memorial",
  icon: DocumentIcon,
  preview: reviewableDocumentPreviewConfig,
  fields: [
    defineField({
      title: "Name",
      name: "name",
      type: "string",
    }),
    simpleDescriptionField,
    requiredUrlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    ratingField,
    readyForReviewField,
  ],
});
