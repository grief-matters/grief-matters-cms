import type { Doc } from "./types";

const markdownFiles = import.meta.glob("/docs/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx !== -1) {
      data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }
  return { data, content: match[2] };
}

export const docs: Doc[] = Object.entries(markdownFiles)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    const id = path.replace("/docs/", "").replace(/\.md$/, "");
    return {
      id,
      title: (data.title as string) ?? id,
      order: Number(data.order) || 999,
      content,
    };
  })
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

export function getDocById(id: string): Doc | undefined {
  return docs.find((d) => d.id === id);
}
