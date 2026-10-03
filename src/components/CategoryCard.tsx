import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface CategoryCardCategory {
  id: string | number;
  name: string;
  slug: string | null;
  description?: string | null;
  imageUrl?: string | null;
}

interface CategoryCardProps {
  category: CategoryCardCategory;
  variant?: "coloring" | "printable";
}

const accents = [
  "from-pink-100 via-rose-50 to-orange-100",
  "from-sky-100 via-cyan-50 to-violet-100",
  "from-yellow-100 via-amber-50 to-emerald-100",
  "from-violet-100 via-fuchsia-50 to-pink-100",
];

const emojiAccents = ["🌈", "⭐", "🖍️", "✨"];

export default function CategoryCard({
  category,
  variant = "coloring",
}: CategoryCardProps) {
  const slug = category.slug ?? "coloring-pages";
  const categoryUrl =
    variant === "printable"
      ? `/printable-coloring-pages/${slug}/`
      : `/coloring-pages/${slug}/`;

  const description = category.description ?? "";
  const imageUrl = category.imageUrl ?? null;
  const accentIndex = Math.abs(Number(category.id) || String(category.id).length) % accents.length;
  const accent = accents[accentIndex];
  const emoji = emojiAccents[accentIndex];

  return (
    <Link
      href={categoryUrl}
      className="group relative block h-full overflow-hidden rounded-[1.65rem] border border-violet-100 bg-white p-2.5 shadow-[0_10px_28px_rgba(76,29,149,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(76,29,149,0.14)] active:scale-[.99]"
    >
      <div className={`relative aspect-[4/3] overflow-hidden rounded-[1.3rem] bg-gradient-to-br ${accent}`}>
        <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-violet-700 shadow-sm">
          {variant === "printable" ? "Print" : "Explore"}
        </span>

        <span className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm" aria-hidden="true">
          {emoji}
        </span>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${category.name} coloring pages`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl font-black text-violet-300/70">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="px-2.5 pb-2 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-black leading-tight text-slate-950 sm:text-lg">
            {category.name}
          </h3>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        {description ? (
          <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-5 text-slate-500 sm:text-sm">
            {description}
          </p>
        ) : (
          <p className="mt-1.5 text-xs font-bold text-violet-500">
            Pick a page and start coloring.
          </p>
        )}

        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-black text-violet-600">
          <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
          {variant === "printable" ? "Ready to print" : "Free coloring fun"}
        </span>
      </div>
    </Link>
  );
}
