import { PresentationIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

export default defineType(
  createBaseInternetResourceSchema({
    name: "course",
    title: "Course",
    icon: PresentationIcon,
  }),
);
