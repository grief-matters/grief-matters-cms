import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

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
  name: "booklet",
  title: "Booklet",
  icon: BookIcon,
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
