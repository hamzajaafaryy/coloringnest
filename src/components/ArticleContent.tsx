import Link from "next/link";
import { parseArticleContent, parseArticleInline } from "@/lib/article-content";

function inline(text: string) {
  return parseArticleInline(text).map((node, index) => {
    switch (node.type) {
      case "link": return node.href.startsWith("/")
        ? <Link key={index} href={node.href} className="font-semibold text-[#59398a] underline underline-offset-4">{node.text}</Link>
        : <a key={index} href={node.href} className="font-semibold text-[#59398a] underline underline-offset-4">{node.text}</a>;
      case "strong": return <strong key={index}>{node.text}</strong>;
      case "em": return <em key={index}>{node.text}</em>;
      case "code": return <code key={index} className="rounded border border-[#2b2140]/15 bg-[#fff3d6] px-1.5 py-0.5 text-[0.9em] text-[#2b2140]">{node.text}</code>;
      default: return node.text;
    }
  });
}

export default function ArticleContent({ content }: { content: string }) {
  return <div data-article-content className="cc-content-page max-w-none space-y-6 break-words text-base sm:text-lg">
    {parseArticleContent(content).map((block, index) => {
      if (block.type === "heading") {
        const Heading = `h${block.level}` as "h2" | "h3" | "h4" | "h5" | "h6";
        return <Heading key={index} className="mb-2 mt-8 text-2xl font-black text-[#2b2140]">{inline(block.text)}</Heading>;
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
