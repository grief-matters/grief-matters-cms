import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";
import { categoryPreviewConfig } from "../../configs/categoryPreviewConfig";
import CategoryPreview from "../../components/CategoryPreview";
import { featuredResourcesField, slugField, titleField } from "../fields";

export default defineType({
  name: "category",
  title: "Topic",
  description: "A category used to classify resources",
  icon: TagsIcon,
  type: "document",
  preview: categoryPreviewConfig,
  components: { preview: CategoryPreview },
  fields: [
    titleField,
    slugField,
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      description:
        "A short description for the category (may appear on the website)",
      validation: (rule) => rule.max(255),
    }),
    defineField({
      title: "Parent Category",
      description:
        "Select the parent category, if this is a sub-category of another",
      name: "parent",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "image",
      title: "Category Cover Image",
      type: "accessibleImage",
      description: "A cover image to associate with this category",
    }),
    featuredResourcesField("article"),
    featuredResourcesField("story"),
  ],
});
