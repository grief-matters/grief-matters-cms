import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import {
  categoriesField,
  populationsField,
  readyForReviewField,
  urlField,
  websiteReferenceField,
} from "../fields";

export default defineType({
  type: "document",
  name: "forum",
  title: "Forum",
  icon: UsersIcon,
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
      type: "string",
    }),
    urlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    readyForReviewField,
  ],
});
