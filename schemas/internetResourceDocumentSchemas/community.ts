import { UsersIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "community",
  title: "Community",
  icon: UsersIcon,
  isUrlRequired: true,
});

const communitySchema = defineType({
  ...base,
  fields: [...base.fields],
});

export default communitySchema;
