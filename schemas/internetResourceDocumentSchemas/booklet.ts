import { BookIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "booklet",
  title: "Booklet",
  icon: BookIcon,
  isUrlRequired: true,
});

const bookletSchema = defineType({
  ...base,
});

export default bookletSchema;
