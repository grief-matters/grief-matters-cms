import { MenuIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import slugField from "../fields/slugField";
import titleField from "../fields/titleField";

export default defineType({
  name: "navigationTree",
  title: "Navigation Tree",
  type: "document",
  icon: MenuIcon,
  description:
    "Defines a hierarchical navigation. It is made up of nav items and groups of nav items that create a hierarchical tree structure",
  fields: [
    slugField,
    defineField({
      ...titleField,
      description:
        "Title for distinguishing this navigation tree in Sanity. Never used for presentation",
    }),
    defineField({
      name: "navigationTreeItems",
      type: "array",
      description:
        "The items to include in this navigation tree. Can be Nav Item groups or single Nav Items",
      of: [
        defineArrayMember({
          type: "navItem",
        }),
        defineArrayMember({
          type: "navItemGroup",
        }),
      ],
    }),
  ],
});
