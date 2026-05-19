import { DocumentPdfIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

export default defineType(
  createBaseInternetResourceSchema({
    name: "printedMaterial",
    title: "Printed Material",
    icon: DocumentPdfIcon,
  })
);
