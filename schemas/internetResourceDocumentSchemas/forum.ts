import { defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";

export default defineType(
  createBaseInternetResourceSchema({
    name: "forum",
    title: "Forum",
    icon: UsersIcon,
    includeQualityScore: true,
  }),
);
