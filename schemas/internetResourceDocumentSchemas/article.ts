import { DocumentIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";
import { defineType } from "sanity";

export default defineType(
  createBaseInternetResourceSchema({
    name: "article",
    title: "Article",
    icon: DocumentIcon,
  }),
);
