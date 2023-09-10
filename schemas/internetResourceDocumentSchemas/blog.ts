import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

import {
  categoriesField,
  populationsField,
  readyForReviewField,
  urlField,
  websiteReferenceField,
} from "../fields";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";

export default defineType({
  type: "document",
  name: "blog",
  title: "Blog",
  icon: DocumentsIcon,
  preview: reviewableDocumentPreviewConfig,
  fields: [
    defineField({
      title: "Title",
      name: "title",
      type: "string",
    }),
    defineField({
      title: "Description",
      name: "description",
      type: "text",
    }),
    urlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    readyForReviewField,
  ],
});
