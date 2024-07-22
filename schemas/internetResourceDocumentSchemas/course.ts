import { PresentationIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "course",
  title: "Course",
  icon: PresentationIcon,
  isUrlRequired: true,
});

const courseSchema = defineType({
  ...base,
});

export default courseSchema;
