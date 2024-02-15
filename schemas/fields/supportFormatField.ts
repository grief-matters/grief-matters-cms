import { defineField } from "sanity";

export const SUPPORT_FORMATS = ["In person", "Virtual"];

export default defineField({
  title: "Format",
  name: "format",
  description: "Mark the format of the support group if relevant",
  type: "string",
  options: {
    list: SUPPORT_FORMATS,
  },
});
