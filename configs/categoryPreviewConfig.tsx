import { PreviewConfig } from "sanity";

const categoryDepth = 4;

function createNestedParents(nestingDepth: number) {
  const result: Record<string, string> = {};

  for (let i = 1; i < nestingDepth; i++) {
    let property = `parent${i}`;
    let path = "parent.".repeat(i);
    result[property] = `${path}title`;
  }

  return result;
}

export const categoryPreviewConfig: PreviewConfig = {
  select: {
    title: "title",
    ...createNestedParents(categoryDepth),
  },
  prepare: ({ title, ...parents }) => ({
    title,
    ...parents,
    subtitle: parents.parent1 ? `in: ${parents.parent1}` : undefined,
  }),
};
