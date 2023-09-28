import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

import {
  categoriesField,
  populationsField,
  ratingField,
  readyForReviewField,
  simpleDescriptionField,
  urlField,
  websiteReferenceField,
} from "../fields";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";

export default defineType({
  type: "document",
  name: "therapyResource",
  title: "Therapy Resource",
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
    ratingField,
    readyForReviewField,
  ],
});
