import ColoringCard from "./ColoringCard";
import { ColoringPage } from "@/lib/data/coloringPages";

interface ColoringGridProps {
  pages: ColoringPage[];
  emptyMessage?: string;
}

export default function ColoringGrid({
  pages,
  emptyMessage = "No coloring pages found.",
}: ColoringGridProps) {
  if (!pages || pages.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-slate-500 font-medium text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pages.map((page, index) => (
        <ColoringCard key={page.id} page={page} priority={index < 4} />
      ))}
    </div>
  );
}
