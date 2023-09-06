import { defineField, defineType } from "sanity";
import { MobileDeviceIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { readyForReviewField } from "../fields";

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
    defineField({
      title: "Resource Details",
      name: "resourceDetails",
      type: "resourceBase",
    }),
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
