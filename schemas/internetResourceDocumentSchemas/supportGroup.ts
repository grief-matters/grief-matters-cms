import { defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";
import supportFormatField from "../fields/supportFormatField";

const base = createBaseInternetResourceSchema({
  name: "supportGroup",
  title: "Support Group",
  icon: UsersIcon,
});

const supportGroupSchema = defineType({
  ...base,
  fields: [...base.fields, supportFormatField],
});

export default supportGroupSchema;
