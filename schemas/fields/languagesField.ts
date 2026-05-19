import { defineField } from "sanity";

export default defineField({
  initialValue: ["english"],
  group: "attributes",
  title: "Languages",
  description: "Available languages for the resource",
  name: "availableLanguages",
  type: "array",
  of: [{ type: "string" }],
  options: {
    list: [
      { title: "English", value: "english" },
      { title: "Spanish", value: "spanish" },
    ],
  },
});
