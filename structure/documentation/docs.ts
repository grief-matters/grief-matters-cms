import type { Doc } from "./types";

const markdownFiles = import.meta.glob("/docs/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

// Bundle any images referenced by the docs. Vite content-hashes these and
// emits them into the Studio build; keys are absolute paths like
// "/docs/images/foo.png", values are the resolved (hashed) asset URLs.
const docImages = import.meta.glob(
  "/docs/**/*.{png,jpg,jpeg,gif,svg,webp,avif}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

// Resolve a `.` / `..` relative path against a base directory, returning a
// normalised path with no leading slash (e.g. "images/foo.png").
function resolvePath(baseDir: string, rel: string): string {
  const stack = baseDir ? baseDir.split("/") : [];
  for (const seg of rel.split("/")) {
    if (seg === "" || seg === ".") {
      continue;
    }
    if (seg === "..") {
      stack.pop();
    } else {
      stack.push(seg);
    }
  }
  return stack.join("/");
}

/**
 * Map a markdown image `src` (as authored, relative to the doc file) to the
 * Vite-bundled asset URL. Leaves absolute URLs and anything we can't resolve
 * to a bundled image untouched, so `https://…`, `data:…` and `/static/…`
 * references still pass straight through.
 */
export function resolveDocImage(
  docId: string,
  src?: string,
): string | undefined {
  if (!src) {
    return src;
  }
  if (/^[a-z]+:/i.test(src) || src.startsWith("//")) {
    return src;
  }

  const docDir = docId.includes("/")
    ? docId.slice(0, docId.lastIndexOf("/"))
    : "";

  const candidates = [
    `/docs/${resolvePath(docDir, src.replace(/^\//, ""))}`,
    `/${resolvePath("", src.replace(/^\//, ""))}`,
    src,
  ];

  for (const key of candidates) {
    if (docImages[key]) {
      return docImages[key];
    }
  }
  return src;
}

function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw };
  }

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
