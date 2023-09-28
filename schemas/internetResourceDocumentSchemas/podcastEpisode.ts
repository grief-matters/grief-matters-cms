import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons";

import {
  categoriesField,
  populationsField,
  ratingField,
  readyForReviewField,
  simpleDescriptionField,
  titleField,
  urlField,
  websiteReferenceField,
} from "../fields";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";

export default defineType({
  type: "document",
  name: "podcastEpisode",
  title: "Podcast Episode",
  icon: PlayIcon,
  preview: reviewableDocumentPreviewConfig,
  fields: [
    titleField,
    simpleDescriptionField,
    urlField,
    websiteReferenceField,
    categoriesField,
    populationsField,
    defineField({
      title: "Podcast",
      name: "parentPodcast",
      type: "reference",
      to: [{ type: "podcast" }],
    }),
    ratingField,
    readyForReviewField,
  ],
});
