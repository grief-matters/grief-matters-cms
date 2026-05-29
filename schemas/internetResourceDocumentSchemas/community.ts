import { UsersIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

export default defineType(
  createBaseInternetResourceSchema({
    name: "community",
    title: "Community",
    icon: UsersIcon,
  }),
);
