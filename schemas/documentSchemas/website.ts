import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { readyForReviewField } from "../fields";
import ResourceUrlInput from "../../components/ResourceUrlInput";

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
    defineField({
      title: "URL",
      name: "websiteUrl",
      type: "url",
      components: {
        input: ResourceUrlInput,
      },
    }),
    defineField({
      title: "Logo",
      name: "logo",
      type: "logo",
    }),
    readyForReviewField,
  ],
});
