import Link from "next/link";
import { Sparkles, Printer } from "lucide-react";

import type { ColoringPage } from "@/lib/data/coloringPages";
import type { DbColoringPageCard } from "@/types/coloring";

interface ColoringCardProps {
  page: ColoringPage | DbColoringPageCard;
  priority?: boolean;
}

export default function ColoringCard({
  page,
  priority = false,
}: ColoringCardProps) {
  const isDbPage = "categoryId" in page;

  const pageSlug = page.slug || "";

  const categorySlug = isDbPage
    ? page.categorySlug || "coloring-pages"
    : page.categorySlug;

  const description = page.description || "";
  const svgContent = page.svgContent || "";

  const imageUrl = isDbPage
    ? page.imageUrl
    : null;

  const altText = isDbPage
    ? page.altText || page.title
    : page.altText;

  const difficulty = page.difficulty || null;

  const pageUrl =
    `/coloring-pages/${categorySlug}/${pageSlug}/`;

  const onlineUrl =
    `/color-online/${pageSlug}/`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between h-full">
      <Link
        href={pageUrl}
        className="relative block w-full aspect-square bg-slate-50 border-b border-slate-100 overflow-hidden p-4 group-hover:bg-indigo-50/20 transition-colors"
        aria-label={`View ${page.title}`}
      >
        <div className="w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-300 group-hover:scale-105">
          {svgContent ? (
            <div
              className="w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{
                __html: svgContent,
              }}
            />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={altText || page.title}
              className="w-full h-full object-contain"
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="text-sm text-slate-400">
              Coloring artwork unavailable.
            </div>
          )}
        </div>

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="text-[11px] font-medium bg-white/95 backdrop-blur-xs text-slate-700 px-2.5 py-0.5 rounded-full shadow-2xs border border-slate-200">
            {categorySlug.toUpperCase()}
          </span>

          {difficulty && (
            <span className="text-[11px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
              {difficulty}
            </span>
          )}
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={pageUrl}>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5">
              {page.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <Link
            href={onlineUrl}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs rounded-xl shadow-xs hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Color Online
          </Link>

          <Link
            href={`${pageUrl}#print`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 hover:text-slate-900 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </Link>
        </div>
      </div>
    </div>
  );
}