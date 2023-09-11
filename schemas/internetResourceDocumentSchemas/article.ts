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
    readyForReviewField,
  ],
});
