import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

import {
  broadFocusToggleField,
  categoriesField,
  populationsField,
  ratingField,
  readyForReviewField,
  simpleDescriptionField,
  urlField,
  websiteReferenceField,
} from "../fields";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { supportFormats } from "./peerSupport";

export default defineType({
  type: "document",
  name: "supportGroup",
  title: "Support Group",
  icon: UsersIcon,
  preview: reviewableDocumentPreviewConfig,
  fields: [
    defineField({
      title: "Name",
      name: "name",
      type: "string",
    }),
    simpleDescriptionField,
    urlField,
    websiteReferenceField,
    broadFocusToggleField,
    categoriesField,
    populationsField,
    defineField({
      title: "Format",
      name: "format",
      description: "Mark the format of the support group if relevant",
      type: "string",
      options: {
        list: supportFormats,
      },
    }),
    ratingField,
    readyForReviewField,
  ],
});
