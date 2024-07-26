import { defineArrayMember, defineField, defineType } from "sanity";
import TopicsField from "../../components/TopicsField";
import { WarningOutlineIcon } from "@sanity/icons";

export default defineType({
  name: "featuredTopics",
  title: "Featured Topics",
  type: "document",
  deprecated: {
    reason: "Featured Topics have been recreated as a Topic Collection",
  },
  icon: WarningOutlineIcon,
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
