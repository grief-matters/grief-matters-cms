import { UserIcon } from "@sanity/icons";
import { defineType } from "sanity";
import { reviewableDocumentPreviewConfig } from "../../configs/reviewableDocumentPreviewConfig";
import { broadFocusToggleField, supportFormatField } from "../fields";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "peerSupport",
  title: "Peer Support",
  icon: UserIcon,
  isUrlRequired: true,
});

// TODO - migrate 'name' to 'title'
const peerSupportSchema = defineType({
  ...base,
  fields: [...base.fields, broadFocusToggleField, supportFormatField],
  preview: reviewableDocumentPreviewConfig,
});

export default peerSupportSchema;
