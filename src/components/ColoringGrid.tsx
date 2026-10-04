import ColoringCard from "./ColoringCard";

import type { ColoringPage } from "@/lib/data/coloringPages";
import type { DbColoringPageCard } from "@/types/coloring";

interface ColoringGridProps {
  pages: Array<ColoringPage | DbColoringPageCard>;
  emptyMessage?: string;
  variant?: "coloring" | "printable";
}

export default function ColoringGrid({
  pages,
  emptyMessage = "No coloring pages found.",
  variant = "coloring",
}: ColoringGridProps) {
  if (!pages || pages.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-violet-100 bg-violet-50/60 px-5 py-12 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
          🎨
        </div>
        <p className="text-sm font-bold text-slate-500 sm:text-base">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {pages.map((page, index) => (
        <ColoringCard
          key={page.id}
          page={page}
          priority={index < 2}
          variant={variant}
        />
      ))}
    </div>
  );
}
