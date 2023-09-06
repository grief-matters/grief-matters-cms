import { defineField, defineType } from "sanity";
import { DocumentPdfIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { readyForReviewField } from "../fields";

export default defineType({
  type: "document",
  name: "brochure",
  title: "Brochure",
  icon: DocumentPdfIcon,
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
    defineField({
      title: "Resource Details",
      name: "resourceDetails",
      type: "resourceBase",
    }),
    readyForReviewField,
  ],
});
