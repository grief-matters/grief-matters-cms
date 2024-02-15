import { DocumentVideoIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "video",
  title: "Video",
  icon: DocumentVideoIcon,
  isUrlRequired: true,
});

const videoSchema = defineType({
  ...base,
  preview: reviewableDocumentPreviewConfig,
});

export default videoSchema;
