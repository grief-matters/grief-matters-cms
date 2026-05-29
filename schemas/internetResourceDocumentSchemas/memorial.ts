import { DocumentIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

export default defineType(
  createBaseInternetResourceSchema({
    name: "memorial",
    title: "Memorial",
    icon: DocumentIcon,
    isUrlRequired: true,
  }),
);
