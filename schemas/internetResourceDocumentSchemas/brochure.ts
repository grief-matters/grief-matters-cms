import { defineType } from "sanity";
import { DocumentPdfIcon } from "@sanity/icons";

import {
  categoriesField,
  populationsField,
  readyForReviewField,
  titleField,
  requiredUrlField,
  websiteReferenceField,
  simpleDescriptionField,
  ratingField,
} from "../fields";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";

export default defineType({
  type: "document",
  name: "brochure",
  title: "Brochure",
  icon: DocumentPdfIcon,
  preview: reviewableDocumentPreviewConfig,
  fields: [
    titleField,
    simpleDescriptionField,
    requiredUrlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    ratingField,
    readyForReviewField,
  ],
});
