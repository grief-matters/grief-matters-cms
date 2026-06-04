import { MenuIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import slugField from "../fields/slugField";
import titleField from "../fields/titleField";

const maxTreeDepth = 4;

type NavNode = {
  _type?: string;
  _key?: string;
  items?: NavNode[];
};

type ValidationPath = Array<string | { _key: string }>;

function findDepthViolations(
  nodes: NavNode[] | undefined,
  depth: number,
  parentPath: ValidationPath,
): ValidationPath[] {
  if (!nodes) {
    return [];
  }
  const violations: ValidationPath[] = [];
  for (const node of nodes) {
    if (!node?._key) {
      continue;
    }
    const nodePath: ValidationPath = [...parentPath, { _key: node._key }];
    if (depth > maxTreeDepth) {
      violations.push(nodePath);
      continue;
    }
    if (node._type === "navItemGroup") {
      violations.push(
        ...findDepthViolations(node.items, depth + 1, [...nodePath, "items"]),
      );
    }
  }
  return violations;
}

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
      validation: (rule) =>
        rule.custom<NavNode[]>((items) => {
          const violations = findDepthViolations(items, 1, []);
          if (!violations.length) {
            return true;
          }
          return {
            message: `Navigation tree may not be deeper than ${maxTreeDepth} levels`,
            paths: violations,
          };
        }),
    }),
  ],
});
