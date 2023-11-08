import { defineField, defineType } from "sanity";
import { TagsIcon } from "@sanity/icons";
import { categoryPreviewConfig } from "../../configs/categoryPreviewConfig";
import CategoryPreview from "../../components/CategoryPreview";
import { featuredResourcesField, slugField } from "../fields";

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
    slugField,
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
