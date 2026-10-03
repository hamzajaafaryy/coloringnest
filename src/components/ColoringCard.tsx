import Link from "next/link";
import { ArrowUpRight, Sparkles, Printer } from "lucide-react";

import type { ColoringPage } from "@/lib/data/coloringPages";
import type { DbColoringPageCard } from "@/types/coloring";
import { sanitizeSvg } from "@/lib/sanitize-svg";

interface ColoringCardProps {
  page: ColoringPage | DbColoringPageCard;
  priority?: boolean;
  variant?: "coloring" | "printable";
}

export default function ColoringCard({ page, priority = false, variant = "coloring" }: ColoringCardProps) {
  const isPrintable = variant === "printable";
  const isDbPage = "categoryId" in page;
  const pageSlug = page.slug || "";
  const categorySlug = isDbPage ? page.categorySlug || "coloring-pages" : page.categorySlug;
  const description = page.description || "";
  const svgContent = page.svgContent ? sanitizeSvg(page.svgContent) : "";
  const imageUrl = isDbPage ? page.imageUrl : null;
  const altText = isDbPage ? page.altText || page.title : page.altText;
  const difficulty = page.difficulty || null;
  const pageUrl = `/coloring-pages/${categorySlug}/${pageSlug}/`;
  const onlineUrl = `/color-online/${pageSlug}/`;
  const cardLabel = isPrintable ? `Open printable ${page.title}` : `View ${page.title}`;

  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white transition-all duration-500 ${isPrintable ? "border-orange-200/80 shadow-[0_10px_35px_rgba(234,88,12,0.08)] hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(234,88,12,0.15)]" : "border-slate-200/80 shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:-translate-y-2 hover:shadow-[0_24px_55px_rgba(124,58,237,0.16)]"}`}>
      <span className={`pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full blur-[1px] transition-transform duration-500 group-hover:scale-150 ${isPrintable ? "bg-orange-300/70" : "bg-yellow-300/70"}`} />
      <span className="pointer-events-none absolute bottom-20 -left-3 h-7 w-7 rotate-12 rounded-lg bg-pink-300/60 transition-transform duration-500 group-hover:rotate-45" />

      <Link href={pageUrl} className={`relative block aspect-square overflow-hidden p-4 ${isPrintable ? "bg-[#f7f4ee]" : "bg-gradient-to-br from-violet-50 via-white to-sky-50"}`} aria-label={cardLabel}>
        <div className={`absolute inset-3 rounded-[1.35rem] border-2 shadow-inner ${isPrintable ? "border-white bg-white" : "border-white/90 bg-white/60"}`} />
        <div className="absolute left-6 top-6 z-10 flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm ${isPrintable ? "bg-white text-orange-700 ring-1 ring-orange-100" : "bg-white/95 text-violet-700 ring-1 ring-violet-100"}`}>
            {isPrintable ? "Printable Sheet" : categorySlug}
          </span>
          {difficulty && <span className="rounded-full bg-yellow-300 px-2.5 py-1 text-[10px] font-black text-slate-800 shadow-sm">{difficulty}</span>}
        </div>

        <div className="relative z-[1] flex h-full w-full items-center justify-center p-3 transition duration-500 group-hover:scale-[1.045] group-hover:rotate-1">
          {imageUrl ? (
            <img src={imageUrl} alt={altText || page.title} className="h-full w-full object-contain drop-shadow-[0_12px_14px_rgba(15,23,42,0.08)]" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
          ) : svgContent ? (
            <div className="flex h-full w-full items-center justify-center" dangerouslySetInnerHTML={{ __html: svgContent }} />
          ) : (
            <div className="text-sm font-semibold text-slate-400">Coloring artwork unavailable.</div>
          )}
        </div>

        <span className={`absolute bottom-6 right-6 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full text-white opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${isPrintable ? "bg-orange-500" : "bg-slate-900"}`}>
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <Link href={pageUrl}>
            <h3 className="mb-1.5 line-clamp-1 text-base font-black text-slate-900 transition-colors group-hover:text-violet-700">{page.title}</h3>
          </Link>
          <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-500">{isPrintable ? `Print-ready ${description.toLowerCase()}` : description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
          {isPrintable ? (
            <>
              <Link href={`${pageUrl}#print`} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-3 py-2.5 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <Printer className="h-3.5 w-3.5" /> Print This Sheet
              </Link>
              <Link href={onlineUrl} className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-50 px-3 py-2 text-[11px] font-black text-violet-700 transition hover:bg-violet-100">
                <Sparkles className="h-3.5 w-3.5" /> Want to color online instead?
              </Link>
            </>
          ) : (
            <>
              <Link href={onlineUrl} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 px-3 py-2.5 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <Sparkles className="h-3.5 w-3.5" /> Color Online
              </Link>
              <Link href={`${pageUrl}#print`} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-black text-slate-700 transition hover:bg-yellow-100 hover:text-slate-900">
                <Printer className="h-3.5 w-3.5" /> Print
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
