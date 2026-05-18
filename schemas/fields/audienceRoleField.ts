import { defineField } from "sanity";

export default defineField({
  name: "audienceRole",
  title: "Audience Role",
  type: "array",
  description:
    "Whose lens the resource is produced for: a bereaved person seeking help for themselves, a supporter helping someone else who is grieving, or a professional working with bereaved clients. Typically a single value.",
  of: [{ type: "string" }],
  options: {
    list: [
      { title: "Bereaved", value: "bereaved" },
      { title: "Supporter", value: "supporter" },
      { title: "Professional", value: "professional" },
    ],
  },
});
