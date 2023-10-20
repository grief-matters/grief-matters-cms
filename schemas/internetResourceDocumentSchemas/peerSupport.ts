import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons";

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

export const supportFormats = ["In person", "Virtual"];

export default defineType({
  type: "document",
  name: "peerSupport",
  title: "Peer Support",
  icon: UserIcon,
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
      type: "string",
      options: {
        list: supportFormats,
      },
    }),
    ratingField,
    readyForReviewField,
  ],
});
