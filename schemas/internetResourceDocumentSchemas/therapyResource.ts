import { defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";
import { hasSpanishVersionField } from "../fields";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "therapyResource",
  title: "Therapy Resource",
  icon: UsersIcon,
  isUrlRequired: true,
});

// TODO - migrate 'name' to 'title' field
const therapyResourceSchema = defineType({
  ...base,
  fields: [...base.fields, hasSpanishVersionField],
});

export default therapyResourceSchema;
