import { PreviewConfig } from "sanity";

export const richTextContentBlockPreviewConfig: PreviewConfig = {
  select: {
    portableText: "portableText",
  },
  prepare: ({ portableText }) => {
    const block = (portableText || []).find(
      (block: any) => block._type === "block"
    );

    return {
      title: "Rich Text Content Block",
      subtitle: block
        ? `Preview: ${block.children
            .filter((child: any) => child._type === "span")
            .map((span: any) => span.text)
            .join("")}`
        : "No preview available",
    };
  },
};
