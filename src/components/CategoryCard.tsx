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

const accents = ["bg-[#ffe7de]", "bg-[#e1efff]", "bg-[#fff1bd]", "bg-[#e1f2e8]"];

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

  return (
    <Link
      href={categoryUrl}
      className="cc-category-card group relative block h-full min-w-0 overflow-hidden bg-white p-2.5 transition duration-200"
    >
      <div className={`relative aspect-[4/3] overflow-hidden rounded-xl ${accent}`}>
        {imageUrl ? (
          <div className="cc-card-art absolute inset-3 flex items-center justify-center overflow-hidden rounded-xl bg-white p-3">
            <img
              src={imageUrl}
              alt={`${category.name} coloring pages`}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl font-black text-blue-800">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="px-2.5 pb-2 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="cc-safe-wrap min-w-0 text-base font-black leading-tight text-slate-950 sm:text-lg">
            {category.name}
          </h3>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        {description ? (
          <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-5 text-slate-500 sm:text-sm">
            {description}
          </p>
        ) : (
          <p className="mt-1.5 text-xs font-bold text-blue-500">
            Pick a page and start coloring.
          </p>
        )}

        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-black text-blue-600">
          <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
          {variant === "printable" ? "Ready to print" : "Free coloring fun"}
        </span>
      </div>
    </Link>
  );
}
