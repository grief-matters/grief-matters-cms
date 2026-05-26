import { defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";

export default defineType(
  createBaseInternetResourceSchema({
    name: "story",
    title: "Story",
    icon: DocumentTextIcon,
  }),
);
