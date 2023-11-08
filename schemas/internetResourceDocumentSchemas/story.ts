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
    defineField({
      name: "image",
      title: "Story Image",
      type: "accessibleImage",
      description:
        "An image to be shown alongside the Story if it has been Featured",
    }),
    requiredUrlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    ratingField,
    readyForReviewField,
  ],
});
