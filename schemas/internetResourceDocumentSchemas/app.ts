import { defineField, defineType } from "sanity";
import { MobileDeviceIcon } from "@sanity/icons";

import {
  categoriesField,
  populationsField,
  readyForReviewField,
  simpleDescriptionField,
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
    simpleDescriptionField,
    urlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    defineField({
      title: "Apple App Store",
      name: "appleUrl",
      type: "url",
      description: "A link to the Apple App Store listing",
      validation: (Rule) =>
        Rule.custom(function (value) {
          if (typeof value === "undefined") {
            return true;
          }

          const isValid = value.startsWith(`https://apps.apple.com/`);
          return isValid
            ? true
            : `Apple App Store links start with 'https://apps.apple.com/'`;
        }),
    }),
    defineField({
      title: "Play Store",
      name: "playStoreUrl",
      type: "url",
      description: "A link to the Google Play Store listing",
      validation: (Rule) =>
        Rule.custom(function (value) {
          if (typeof value === "undefined") {
            return true;
          }

          const isValid = value.startsWith(
            `https://play.google.com/store/apps/`
          );
          return isValid
            ? true
            : `Google Play Store links start with 'https://play.google.com/store/apps/'`;
        }),
    }),
    readyForReviewField,
  ],
});
