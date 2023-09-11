import { defineField, defineType } from "sanity";
import { DocumentVideoIcon } from "@sanity/icons";

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
  name: "video",
  title: "Video",
  icon: DocumentVideoIcon,
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
