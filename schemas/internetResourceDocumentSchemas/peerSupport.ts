import { UserIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";
import supportFormatField from "../fields/supportFormatField";

const base = createBaseInternetResourceSchema({
  name: "peerSupport",
  title: "Peer Support",
  icon: UserIcon,
  isUrlRequired: true,
});

const peerSupportSchema = defineType({
  ...base,
  fields: [...base.fields, supportFormatField],
});

export default peerSupportSchema;
