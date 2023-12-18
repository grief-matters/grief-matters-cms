import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import {
  categoriesField,
  hasSpanishVersionField,
  populationsField,
  readyForReviewField,
  simpleDescriptionField,
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
    simpleDescriptionField,
    hasSpanishVersionField,
    defineField({
      name: "directlyQuoted",
      title: "Description quoted from website.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      ...urlField,
      validation: (Rule) =>
        Rule.custom((resourceUrl) => {
          const pattern = new RegExp("http[s]*://[^/]+(/.+)");
          if (typeof resourceUrl === "undefined") {
            return true;
          } else if (pattern.test(resourceUrl)) {
            return "Warning: It is more likely that this URL points to a resource rather than a website.";
          } else {
            return true;
          }
        }).warning(),
    }),
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
