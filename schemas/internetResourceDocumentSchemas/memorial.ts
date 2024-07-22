import { DocumentIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "memorial",
  title: "Memorial",
  icon: DocumentIcon,
  isUrlRequired: true,
});

// TODO - migrate 'name' to 'title'
const memorialSchema = defineType({
  ...base,
});

export default memorialSchema;
