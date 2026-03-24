import { PreviewConfig } from "sanity";

export const richTextContentBlockPreviewConfig: PreviewConfig = {
  select: {
    portableText: "portableText",
  },
  prepare: ({ portableText }) => {
    const block = (portableText || []).find(
      (block: {
        _type: string;
        children?: Array<{ _type: string; text?: string }>;
      }) => block._type === "block"
    );

    return {
      title: "Rich Text Content Block",
      subtitle: block
        ? `Preview: ${block.children
            .filter((child: { _type: string }) => child._type === "span")
            .map((span: { text?: string }) => span.text)
            .join("")}`
        : "No preview available",
    };
  },
};
