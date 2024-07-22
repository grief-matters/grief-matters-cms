import { PresentationIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

const base = createBaseInternetResourceSchema({
  name: "webinar",
  title: "Webinar",
  icon: PresentationIcon,
  isUrlRequired: true,
});

const webinarSchema = defineType({
  ...base,
});

export default webinarSchema;
