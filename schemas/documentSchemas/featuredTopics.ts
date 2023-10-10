import { defineArrayMember, defineField, defineType } from "sanity";
import TopicsField from "../../components/TopicsField";

export default defineType({
  name: "featuredTopics",
  title: "Featured Topics",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Featured Topics",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "topics",
      title: "Featured Topics",
      description: "placeholder",
      type: "array",
      components: {
        field: TopicsField,
      },
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "category" }, { type: "smartCategory" }],
        }),
      ],
    }),
  ],
});
