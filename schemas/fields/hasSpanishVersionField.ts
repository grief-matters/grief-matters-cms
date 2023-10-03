import { defineField } from "sanity";

export default defineField({
  title: "Available in Spanish",
  name: "hasSpanishVersion",
  type: "boolean",
  initialValue: false,
});
