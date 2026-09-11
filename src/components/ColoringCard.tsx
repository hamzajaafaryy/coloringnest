import Link from "next/link";
import { Sparkles, Printer, ArrowRight, Palette } from "lucide-react";
import { ColoringPage } from "@/lib/data/coloringPages";

interface ColoringCardProps {
  page: ColoringPage;
  priority?: boolean;
}

export default function ColoringCard({ page }: ColoringCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between h-full">
      {/* SVG Image Preview Container */}
      <Link
        href={`/coloring-pages/${page.categorySlug}/${page.slug}/`}
        className="relative block w-full aspect-square bg-slate-50 border-b border-slate-100 overflow-hidden p-4 group-hover:bg-indigo-50/20 transition-colors"
      >
        <div
          className="w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-300 group-hover:scale-105"
          dangerouslySetInnerHTML={{ __html: page.svgContent }}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="text-[11px] font-medium bg-white/95 backdrop-blur-xs text-slate-700 px-2.5 py-0.5 rounded-full shadow-2xs border border-slate-200">
            {page.categorySlug.toUpperCase()}
          </span>
          <span className="text-[11px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
            {page.difficulty}
          </span>
        </div>
      </Link>

      {/* Content details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/coloring-pages/${page.categorySlug}/${page.slug}/`}>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5">
              {page.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {page.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <Link
            href={`/color-online/${page.slug}/`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs rounded-xl shadow-xs hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Color Online
          </Link>

          <Link
            href={`/coloring-pages/${page.categorySlug}/${page.slug}/#print`}
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
