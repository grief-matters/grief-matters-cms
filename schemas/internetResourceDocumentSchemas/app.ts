import { defineField, defineType } from "sanity";
import { MobileDeviceIcon } from "@sanity/icons";

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
  name: "app",
  title: "App",
  icon: MobileDeviceIcon,
  preview: reviewableDocumentPreviewConfig,
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
    urlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    defineField({
      title: "Apple App Store",
      name: "appleUrl",
      type: "url",
    }),
    defineField({
      title: "Play Store",
      name: "playStoreUrl",
      type: "url",
    }),
    readyForReviewField,
  ],
});
