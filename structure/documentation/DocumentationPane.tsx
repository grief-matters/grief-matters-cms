import { Box, Card, Text } from "@sanity/ui";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getDocById } from "./docs";
import "./documentation.css";

interface DocumentationPaneProps {
  options?: { documentId?: string };
}

export function DocumentationPane({ options }: DocumentationPaneProps) {
  const doc = options?.documentId ? getDocById(options.documentId) : undefined;

  if (!doc) {
    return (
      <Box padding={4}>
        <Card padding={4} radius={2} tone="caution">
          <Text>Documentation not found.</Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box padding={4} className="documentation">
      <Markdown remarkPlugins={[remarkGfm]}>{doc.content}</Markdown>
    </Box>
  );
}
