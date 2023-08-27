import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { readyForReviewField } from "../fields";

export default defineType({
  type: "document",
  name: "book",
  title: "Book",
  icon: BookIcon,
  preview: reviewableDocumentPreviewConfig,
  initialValue: {
    validated: "false",
  },
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
    defineField({
      title: "Resource Details",
      name: "resourceDetails",
      type: "resourceBase",
    }),
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
