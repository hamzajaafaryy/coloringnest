import Link from "next/link";
import { Palette, Printer, Sparkles } from "lucide-react";

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
    <article className="cc-coloring-card group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.6rem] border border-violet-100 bg-white shadow-[0_10px_30px_rgba(30,41,59,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(124,58,237,0.15)]">
      <Link
        href={pageUrl}
        className={`relative block w-full shrink-0 aspect-[4/3] overflow-hidden ${isPrintable ? "bg-orange-50" : "bg-violet-50"}`}
        aria-label={`${isPrintable ? "Open printable" : "View"} ${page.title}`}
      >
        <div className="cc-card-art absolute inset-3 flex items-center justify-center overflow-hidden rounded-xl bg-white p-3 sm:inset-4 sm:p-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={altText || `${page.title} coloring page`}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          ) : svgContent ? (
            <div
              className="h-full w-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="px-4 text-center text-sm font-bold text-slate-400">
              Artwork coming soon.
            </div>
          )}
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex min-w-0 flex-wrap gap-1.5 text-[10px] font-bold">
            <span className="cc-safe-wrap rounded-lg bg-violet-50 px-2 py-1 capitalize text-violet-700">
              {isPrintable ? "Printable" : categoryName}
            </span>
            {difficulty && <span className="cc-safe-wrap rounded-lg bg-yellow-100 px-2 py-1 text-slate-700">{difficulty}</span>}
          </div>
          <Link href={pageUrl} className="block rounded-lg">
            <h3 className="cc-safe-wrap line-clamp-2 text-sm font-black leading-snug text-slate-950 transition group-hover:text-violet-700 sm:text-base">
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
              <Printer className="h-4 w-4 shrink-0" />
              Print page
            </Link>
          ) : (
            <div className="cc-card-actions grid grid-cols-1 gap-2">
              <Link
                href={onlineUrl}
                className="cc-btn cc-btn-primary min-w-0 px-2.5 text-[11px] sm:text-xs"
                aria-label={`Color ${page.title} online`}
              >
                <Palette className="h-4 w-4 shrink-0" />
                <span>Color online</span>
              </Link>
              <Link
                href={`${pageUrl}#print`}
                className="cc-btn cc-btn-print min-w-0 w-full px-2.5 text-[11px] sm:text-xs"
                aria-label={`Print ${page.title}`}
                title="Print"
              >
                <Printer className="h-4 w-4 shrink-0" />
                <span>Print</span>
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
