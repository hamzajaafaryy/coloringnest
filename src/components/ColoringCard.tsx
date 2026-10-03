import Link from "next/link";
import { ArrowRight, Palette, Printer, Sparkles } from "lucide-react";

import type { ColoringPage } from "@/lib/data/coloringPages";
import type { DbColoringPageCard } from "@/types/coloring";
import { sanitizeSvg } from "@/lib/sanitize-svg";

interface ColoringCardProps {
  page: ColoringPage | DbColoringPageCard;
  priority?: boolean;
  variant?: "coloring" | "printable";
}

export default function ColoringCard({
  page,
  priority = false,
  variant = "coloring",
}: ColoringCardProps) {
  const isPrintable = variant === "printable";
  const isDbPage = "categoryId" in page;
  const pageSlug = page.slug || "";
  const categorySlug = isDbPage
    ? page.categorySlug || "coloring-pages"
    : page.categorySlug;
  const categoryName = isDbPage
    ? page.categoryName || categorySlug.replace(/-/g, " ")
    : categorySlug.replace(/-/g, " ");
  const description = page.description || "";
  const svgContent = page.svgContent ? sanitizeSvg(page.svgContent) : "";
  const imageUrl = isDbPage ? page.imageUrl : null;
  const altText = isDbPage ? page.altText || page.title : page.altText;
  const difficulty = page.difficulty || null;
  const ageRange = page.ageRange || null;

  const pageUrl = isPrintable
    ? `/printable-coloring-pages/${categorySlug}/${pageSlug}/`
    : `/coloring-pages/${categorySlug}/${pageSlug}/`;

  const onlineUrl = `/color-online/${pageSlug}/`;

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.6rem] border border-violet-100 bg-white shadow-[0_10px_30px_rgba(30,41,59,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(124,58,237,0.15)]">
      <Link
        href={pageUrl}
        className={`relative block aspect-square overflow-hidden p-2.5 sm:p-3 ${isPrintable ? "bg-orange-50" : "bg-gradient-to-br from-violet-50 via-white to-sky-50"}`}
        aria-label={`${isPrintable ? "Open printable" : "View"} ${page.title}`}
      >
        <div className="absolute inset-2.5 rounded-[1.25rem] border-2 border-white bg-white shadow-inner sm:inset-3" />

        <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-[9px] font-black capitalize shadow-sm ring-1 sm:text-[10px] ${isPrintable ? "bg-orange-50 text-orange-700 ring-orange-100" : "bg-violet-50 text-violet-700 ring-violet-100"}`}>
            {isPrintable ? "Printable" : categoryName}
          </span>
          {difficulty && (
            <span className="rounded-full bg-yellow-300 px-2.5 py-1 text-[9px] font-black text-slate-900 shadow-sm sm:text-[10px]">
              {difficulty}
            </span>
          )}
        </div>

        <div className="relative z-[1] flex h-full w-full items-center justify-center overflow-hidden p-3 pt-10 transition duration-300 group-hover:scale-[1.025] sm:p-4 sm:pt-11">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={altText || `${page.title} coloring page`}
              className="cc-media max-h-full drop-shadow-[0_10px_12px_rgba(15,23,42,0.08)]"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          ) : svgContent ? (
            <div
              className="flex h-full w-full items-center justify-center overflow-hidden [&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-h-full [&>svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="px-4 text-center text-sm font-bold text-slate-400">
              Artwork coming soon.
            </div>
          )}
        </div>

        <span className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg transition group-hover:bg-violet-600">
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex-1">
          <Link href={pageUrl} className="block rounded-lg">
            <h3 className="line-clamp-2 text-sm font-black leading-snug text-slate-950 transition group-hover:text-violet-700 sm:text-base">
              {page.title}
            </h3>
          </Link>

          {ageRange && (
            <p className="mt-1.5 text-[10px] font-black uppercase tracking-wide text-slate-400 sm:text-[11px]">
              {ageRange}
            </p>
          )}

          {description && (
            <p className="mt-2 hidden line-clamp-2 text-xs font-medium leading-5 text-slate-500 sm:block">
              {description}
            </p>
          )}
        </div>

        <div className="mt-3 border-t border-slate-100 pt-3">
          {isPrintable ? (
            <Link
              href={`${pageUrl}#print`}
              className="cc-btn cc-btn-print w-full px-3 text-xs"
              aria-label={`Print ${page.title}`}
            >
              <Printer className="h-4 w-4" />
              Print page
            </Link>
          ) : (
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <Link
                href={onlineUrl}
                className="cc-btn cc-btn-primary min-w-0 px-2.5 text-[11px] sm:text-xs"
                aria-label={`Color ${page.title} online`}
              >
                <Palette className="h-4 w-4 shrink-0" />
                <span className="truncate">Color online</span>
              </Link>
              <Link
                href={`${pageUrl}#print`}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                aria-label={`Print ${page.title}`}
                title="Print"
              >
                <Printer className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {!isPrintable && (
          <div className="mt-2 hidden items-center gap-1 text-[10px] font-black text-violet-500 sm:flex">
            <Sparkles className="h-3 w-3 text-yellow-500" />
            Free • no sign-up
          </div>
        )}
      </div>
    </article>
  );
}
