export type ArticleInline =
  | { type: "text" | "strong" | "em" | "code"; text: string }
  | { type: "link"; text: string; href: string };

export type ArticleBlock =
  | { type: "heading"; level: 2 | 3 | 4 | 5 | 6; text: string }
  | { type: "paragraph" | "code"; text: string }
  | { type: "list"; ordered: boolean; start: number; items: string[] };

export function safeArticleHref(value: string): string | null {
  if (!value || /[\u0000-\u0020\u007f\\]/.test(value)) return null;
  if (value.startsWith("#")) return value;
  if (value.startsWith("/") && !value.startsWith("//")) {
    const parsed = new URL(value, "https://article.invalid");
    return parsed.origin === "https://article.invalid" ? value : null;
  }
  if (!/^https?:\/\//i.test(value)) return null;
  try {
    const url = new URL(value);
    return !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

// Deliberately support a small, non-HTML Markdown subset. Everything is
// rendered as React text, never injected HTML or executable article content.
export function parseArticleInline(text: string): ArticleInline[] {
  const nodes: ArticleInline[] = [];
  const pattern = /\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|`([^`\n]+)`/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > cursor) nodes.push({ type: "text", text: text.slice(cursor, match.index) });
    if (match[1] !== undefined) {
      const href = safeArticleHref(match[2]);
      nodes.push(href ? { type: "link", text: match[1], href } : { type: "text", text: match[1] });
    } else if (match[3] !== undefined) nodes.push({ type: "strong", text: match[3] });
    else if (match[4] !== undefined) nodes.push({ type: "em", text: match[4] });
    else nodes.push({ type: "code", text: match[5] });
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) nodes.push({ type: "text", text: text.slice(cursor) });
  return nodes;
}

const heading = /^(#{1,6})\s+(.+)$/;
const listItem = /^\s*(?:([-*+])|(\d+)[.)])\s+(.+)$/;
const isBlockStart = (line: string) => heading.test(line) || listItem.test(line) || line.startsWith("```");

export function parseArticleContent(content: string): ArticleBlock[] {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ArticleBlock[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index++; continue; }
    if (line.startsWith("```")) {
      const text: string[] = [];
      index++;
      while (index < lines.length && !lines[index].trim().startsWith("```")) text.push(lines[index++]);
      if (index < lines.length) index++;
      blocks.push({ type: "code", text: text.join("\n") });
      continue;
    }
    const title = heading.exec(line);
    if (title) {
      blocks.push({ type: "heading", level: Math.max(2, title[1].length) as 2 | 3 | 4 | 5 | 6, text: title[2] });
      index++;
      continue;
    }
    const firstItem = listItem.exec(line);
    if (firstItem) {
      const ordered = Boolean(firstItem[2]);
      const items: string[] = [];
      while (index < lines.length) {
        const item = listItem.exec(lines[index]);
        if (!item || Boolean(item[2]) !== ordered) break;
        items.push(item[3]);
        index++;
      }
      blocks.push({ type: "list", ordered, start: ordered ? Number(firstItem[2]) : 1, items });
      continue;
    }
    const text = [line];
    index++;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index].trim())) text.push(lines[index++].trim());
    blocks.push({ type: "paragraph", text: text.join(" ") });
  }
  return blocks;
}
