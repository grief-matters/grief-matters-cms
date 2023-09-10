import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

import {
  categoriesField,
  populationsField,
  readyForReviewField,
  titleField,
  urlField,
  websiteReferenceField,
} from "../fields";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";

export default defineType({
  type: "document",
  name: "book",
  title: "Book",
  icon: BookIcon,
  preview: reviewableDocumentPreviewConfig,
  fields: [
    titleField,
    defineField({
      title: "Description",
      name: "description",
      type: "text",
    }),
    urlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    defineField({
      title: "Author",
      name: "author",
      type: "string",
    }),
    defineField({
      title: "ISBN",
      name: "isbn",
      type: "string",
      validation: (rule) =>
        rule.min(10).max(13).error("An ISBN is 10 or 13 digits long"),
    }),
    readyForReviewField,
  ],
});
