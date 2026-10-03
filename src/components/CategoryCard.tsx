import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface CategoryCardCategory {
  id: string | number;
  name: string;
  slug: string | null;
  description?: string | null;
  imageUrl?: string | null;
}
interface CategoryCardProps { category: CategoryCardCategory; variant?: "coloring" | "printable"; }

const accents = [
  "from-pink-100 via-white to-orange-100",
  "from-sky-100 via-white to-violet-100",
  "from-yellow-100 via-white to-emerald-100",
  "from-violet-100 via-white to-fuchsia-100",
];

export default function CategoryCard({ category, variant = "coloring" }: CategoryCardProps) {
  const slug = category.slug ?? "coloring-pages";
  const categoryUrl = variant === "printable" ? `/printable-coloring-pages/${slug}/` : `/coloring-pages/${slug}/`;
  const description = category.description ?? "";
  const imageUrl = category.imageUrl ?? null;
  const accent = accents[String(category.id).length % accents.length];

  return (
    <Link href={categoryUrl} className="group relative block overflow-hidden rounded-[1.75rem] border border-white bg-white p-2 shadow-[0_12px_35px_rgba(15,23,42,0.07)] transition-all duration-500 hover:-translate-y-2 hover:rotate-[0.4deg] hover:shadow-[0_24px_55px_rgba(124,58,237,0.15)]">
      <div className={`relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-gradient-to-br ${accent}`}>
        <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/50 transition-transform duration-500 group-hover:scale-150" />
        <span className="absolute bottom-4 left-4 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-violet-700 shadow-sm">
          Explore
        </span>
        {imageUrl ? (
          <img src={imageUrl} alt={category.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl font-black text-violet-200/80">{category.name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-violet-600 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 px-3 pb-3 pt-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 transition-colors group-hover:text-violet-700">{category.name}</h3>
          {description && <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">{description}</p>}
        </div>
        <Sparkles className="mt-1 h-4 w-4 shrink-0 text-yellow-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
      </div>
    </Link>
  );
}
