import { defineField } from "sanity";

export default defineField({
  title: "Source",
  name: "sourceOrg",
  description:
    "The parent organization or provider that this resource belongs to",
  type: "reference",
  to: [{ type: "externalOrg" }],
});
