import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { supportFormats } from "./peerSupport";
import { readyForReviewField } from "../fields";

export default defineType({
  type: "document",
  name: "supportGroup",
  title: "Support Group",
  icon: UsersIcon,
  preview: reviewableDocumentPreviewConfig,
  initialValue: {
    validated: "false",
  },
  fields: [
    defineField({
      title: "Name",
      name: "name",
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
      title: "Format",
      name: "format",
      type: "string",
      options: {
        list: supportFormats,
      },
    }),
    readyForReviewField,
  ],
});
