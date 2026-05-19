import { DocumentVideoIcon } from "@sanity/icons";
import { defineType } from "sanity";

import { createBaseInternetResourceSchema } from "../helpers";

export default defineType(
  createBaseInternetResourceSchema({
    name: "video",
    title: "Video",
    icon: DocumentVideoIcon,
  })
);
