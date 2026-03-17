import { defineField } from "sanity";

export default defineField({
  title: "Paywalled Resource",
  description:
    "This marks the resource as being behind a paywall or subscription",
  name: "paywalled",
  type: "boolean",
  initialValue: false,
});
