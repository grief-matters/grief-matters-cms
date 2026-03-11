import { defineField } from "sanity";

export default defineField({
  title: "Format",
  name: "format",
  description: "Mark the format of the support group if relevant",
  type: "array",
  of: [{ type: "string" }],
  options: {
    list: [
      { title: "In person", value: "in-person" },
      { title: "Remote/Telehealth", value: "remote" },
    ],
  },
});
