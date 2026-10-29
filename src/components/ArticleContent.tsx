import Link from "next/link";
import { parseArticleContent, parseArticleInline } from "@/lib/article-content";

function inline(text: string) {
  return parseArticleInline(text).map((node, index) => {
    switch (node.type) {
      case "link": return node.href.startsWith("/")
        ? <Link key={index} href={node.href} className="font-semibold text-indigo-700 underline underline-offset-4">{node.text}</Link>
        : <a key={index} href={node.href} className="font-semibold text-indigo-700 underline underline-offset-4">{node.text}</a>;
      case "strong": return <strong key={index}>{node.text}</strong>;
      case "em": return <em key={index}>{node.text}</em>;
      case "code": return <code key={index} className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em]">{node.text}</code>;
      default: return node.text;
    }
  });
}

export default function ArticleContent({ content }: { content: string }) {
  return <div data-article-content className="prose prose-indigo max-w-none space-y-6 break-words text-base leading-relaxed text-slate-700 sm:text-lg">
    {parseArticleContent(content).map((block, index) => {
      if (block.type === "heading") {
        const Heading = `h${block.level}` as "h2" | "h3" | "h4" | "h5" | "h6";
        return <Heading key={index} className="mb-2 mt-8 text-2xl font-bold text-slate-900">{inline(block.text)}</Heading>;
      }
      if (block.type === "list") {
        const items = block.items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>);
        return block.ordered
          ? <ol key={index} start={block.start} className="list-decimal space-y-2 pl-6">{items}</ol>
          : <ul key={index} className="list-disc space-y-2 pl-6">{items}</ul>;
      }
      if (block.type === "code") return <pre key={index} className="overflow-x-auto rounded-xl bg-slate-100 p-4 text-sm"><code>{block.text}</code></pre>;
      return <p key={index}>{inline(block.text)}</p>;
    })}
  </div>;
}
