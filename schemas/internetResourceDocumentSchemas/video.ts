import { defineField, defineType } from "sanity";
import { DocumentVideoIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { readyForReviewField } from "../fields";

export default defineType({
  type: "document",
  name: "video",
  title: "Video",
  icon: DocumentVideoIcon,
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
    readyForReviewField,
  ],
});
