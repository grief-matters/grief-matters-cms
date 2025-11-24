import { UsersIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "communities",
  title: "Communities",
  icon: UsersIcon,
  isUrlRequired: true,
});

const communitiesSchema = defineType({
  ...base,
  fields: [...base.fields],
});

export default communitiesSchema;
