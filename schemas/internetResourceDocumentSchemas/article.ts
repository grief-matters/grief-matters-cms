import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import {
  categoriesField,
  populationsField,
  readyForReviewField,
  titleField,
  requiredUrlField,
  websiteReferenceField,
  simpleDescriptionField,
  ratingField,
  hasSpanishVersionField,
} from "../fields";

export default defineType({
  type: "document",
  name: "article",
  title: "Article",
  icon: DocumentIcon,
  preview: reviewableDocumentPreviewConfig,
  fields: [
    titleField,
    simpleDescriptionField,
    defineField({
      name: "image",
      title: "Article Image",
      type: "accessibleImage",
      description:
        "An image to be shown alongside the Article if it has been Featured",
    }),
    hasSpanishVersionField,
    requiredUrlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    defineField({
      title: "Parent Blog",
      name: "parentBlog",
      type: "reference",
      to: [{ type: "blog" }],
    }),
    ratingField,
    readyForReviewField,
  ],
});
