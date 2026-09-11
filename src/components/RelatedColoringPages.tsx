import ColoringGrid from "./ColoringGrid";
import { ColoringPage } from "@/lib/data/coloringPages";

interface RelatedColoringPagesProps {
  pages: ColoringPage[];
  title?: string;
}

export default function RelatedColoringPages({
  pages,
  title = "More Coloring Pages You Might Love",
}: RelatedColoringPagesProps) {
  if (!pages || pages.length === 0) return null;

  return (
    <section className="my-12 pt-8 border-t border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>
      <ColoringGrid pages={pages} />
    </section>
  );
}
