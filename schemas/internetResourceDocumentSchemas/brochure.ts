import { DocumentPdfIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "brochure",
  title: "Brochure",
  icon: DocumentPdfIcon,
  isUrlRequired: true,
});

const brochureSchema = defineType({
  ...base,
  preview: reviewableDocumentPreviewConfig,
});

export default brochureSchema;
