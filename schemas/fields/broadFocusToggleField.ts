import { defineField } from "sanity";

export default defineField({
  name: "hasBroadFocus",
  title: "Resource has a broad focus",
  description: `You can mark this resource as having a "broad focus". This will surface the resource in across all categories`,
  type: "boolean",
  initialValue: false,
});
