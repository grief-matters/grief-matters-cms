import { defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";
import { broadFocusToggleField, supportFormatField } from "../fields";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "supportGroup",
  title: "Support Group",
  icon: UsersIcon,
  isUrlRequired: true,
});

// TODO - migrate 'name' to 'title'
const supportGroupSchema = defineType({
  ...base,
  fields: [...base.fields, broadFocusToggleField, supportFormatField],
});

export default supportGroupSchema;
