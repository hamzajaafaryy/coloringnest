import { Fragment } from "react";

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : <Fragment key={index}>{part}</Fragment>
  );
}

// Render a small, safe Markdown subset; raw HTML is always escaped by React.
export default function ArticleContent({ content }: { content: string }) {
  const blocks = content.replace(/\r\n?/g, "\n").trim().split(/\n\s*\n/);
  return <div className="max-w-3xl space-y-6 text-base leading-8 text-slate-700">{blocks.map((block, index) => {
    const lines = block.split("\n");
    const heading = lines[0].match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const Heading = heading[1].length === 3 ? "h3" : "h2";
      return <section key={index} className="space-y-3"><Heading className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl">{inline(heading[2])}</Heading>{lines.length > 1 && <ArticleContent content={lines.slice(1).join("\n")} />}</section>;
    }
    if (lines.every(line => /^[-*]\s+/.test(line))) return <ul key={index} className="list-disc space-y-2 pl-6">{lines.map((line, i) => <li key={i}>{inline(line.replace(/^[-*]\s+/, ""))}</li>)}</ul>;
    if (lines.every(line => /^\d+\.\s+/.test(line))) return <ol key={index} className="list-decimal space-y-2 pl-6">{lines.map((line, i) => <li key={i}>{inline(line.replace(/^\d+\.\s+/, ""))}</li>)}</ol>;
    return <p key={index} className="cc-safe-wrap">{inline(lines.join(" "))}</p>;
  })}</div>;
}
