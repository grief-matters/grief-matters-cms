import { DocumentPdfIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "printedMaterial",
  title: "Printed Material",
  icon: DocumentPdfIcon,
  isUrlRequired: true,
});

const printedMaterialSchema = defineType({
  ...base,
});

export default printedMaterialSchema;
