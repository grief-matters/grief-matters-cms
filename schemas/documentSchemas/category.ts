import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";
import { categoryPreviewConfig } from "../../configs/categoryPreviewConfig";
import CategoryPreview from "../../components/CategoryPreview";

export default defineType({
  name: "category",
  title: "Category",
  description: "A category used to classify resources",
  icon: TagsIcon,
  type: "document",
  preview: categoryPreviewConfig,
  components: { preview: CategoryPreview },
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "description",
      description:
        "Describes the kinds of resources that would qualify for this category",
      type: "string",
    }),
    defineField({
      title: "Parent Category",
      description:
        "Select the parent category, if this is a sub-category of another",
      name: "parent",
      type: "reference",
      to: [{ type: "category" }],
    }),
  ],
});
