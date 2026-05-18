import { DocumentPdfIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";
import audienceRoleField from "../fields/audienceRoleField";

const base = createBaseInternetResourceSchema({
  name: "printedMaterial",
  title: "Printed Material",
  icon: DocumentPdfIcon,
  isUrlRequired: true,
});

const printedMaterialSchema = defineType({
  ...base,

  fields: [
    ...base.fields,
    defineField({ group: "classification", ...audienceRoleField }),
  ],
});

export default printedMaterialSchema;
