import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import {
  categoriesField,
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
    defineField({
      name: "directlyQuoted",
      title: "Description text quoted directly",
      description: `Some or all of the description text was taken directly from the source wesbite`,
      type: "boolean",
      initialValue: false,
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
