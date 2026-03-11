import { defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

import { supportFormatField } from "../fields";
import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "supportGroup",
  title: "Support Group",
  icon: UsersIcon,
  isUrlRequired: true,
});

const supportGroupSchema = defineType({
  ...base,
  fields: [...base.fields, supportFormatField],
});

export default supportGroupSchema;
