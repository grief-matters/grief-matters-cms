import { DocumentsIcon } from "@sanity/icons";

import { createBaseInternetResourceSchema } from "../helpers";
import { defineType } from "sanity";

export default defineType(
  createBaseInternetResourceSchema({
    name: "blog",
    title: "Blog",
    icon: DocumentsIcon,
  })
);
