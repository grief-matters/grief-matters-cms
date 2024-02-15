import { PresentationIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "webinar",
  title: "Webinar",
  icon: PresentationIcon,
  isUrlRequired: true,
});

const webinarSchema = defineType({
  ...base,
  preview: reviewableDocumentPreviewConfig,
});

export default webinarSchema;
