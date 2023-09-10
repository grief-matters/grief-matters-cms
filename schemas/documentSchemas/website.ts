import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import {
  categoriesField,
  populationsField,
  readyForReviewField,
  urlField,
} from "../fields";

export default defineType({
  name: "website",
  title: "Website",
  type: "document",
  icon: EarthGlobeIcon,
  preview: reviewableDocumentPreviewConfig,
  fields: [
    defineField({
      title: "Website Name",
      name: "name",
      type: "string",
    }),
    defineField({
      title: "Description",
      name: "description",
      type: "text",
    }),
    urlField,
    defineField({
      title: "Logo",
      name: "logo",
      type: "logo",
    }),
    categoriesField,
    populationsField,
    readyForReviewField,
  ],
});
