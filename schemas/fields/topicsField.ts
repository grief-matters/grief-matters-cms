import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "topics",
  title: "Topics",
  type: "array",
  description:
    "Subject matter(s) or themes covered by this resource (e.g. anger, self-care, funerals & memorials). A content-rich resource may legitimately span several topics.",
  of: [
    defineArrayMember({
      type: "reference",
      to: [{ type: "topic" }],
    }),
  ],
  validation: (Rule) => Rule.unique(),
});
