import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

import {
  categoriesField,
  populationsField,
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
    readyForReviewField,
  ],
});
