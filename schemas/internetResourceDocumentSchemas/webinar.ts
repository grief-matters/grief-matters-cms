import { PresentationIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

export default defineType(
  createBaseInternetResourceSchema({
    name: "webinar",
    title: "Webinar",
    icon: PresentationIcon,
  })
);
