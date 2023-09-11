import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons";

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
  name: "podcast",
  title: "Podcast",
  icon: PlayIcon,
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
      type: "url",
      name: "spotifyUrl",
      title: "Spotify",
    }),
    defineField({
      type: "url",
      name: "appleUrl",
      title: "Apple",
    }),
    readyForReviewField,
  ],
});
