import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import CategoryArtwork from "@/components/home/CategoryArtwork";

interface CategoryCardCategory {
  id: string | number;
  name: string;
  slug: string | null;
  description?: string | null;
  imageUrl?: string | null;
  pageCount?: number;
}
interface CategoryCardProps {
  category: CategoryCardCategory;
  variant?: "coloring" | "printable";
}

const accents = [
  "from-[#ffecf1] via-[#fff8f4] to-[#ffe8d2]",
  "from-[#e2f5fc] via-[#f7f8ff] to-[#ecedff]",
  "from-[#fef0cc] via-[#fffdf0] to-[#e8f5dd]",
  "from-[#eee2fd] via-[#fdf8ff] to-[#ffe4f0]",
];

export default function CategoryCard({
  category,
  variant = "coloring",
}: CategoryCardProps) {
  const slug = category.slug || "";
  const href = variant === "printable"
    ? "/printable-coloring-pages/" + slug + "/"
    : "/coloring-pages/" + slug + "/";
  const accent = accents[String(category.id).length % accents.length];

  return (
    <Link
      href={href}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.6rem] border border-[#ede6f1] bg-white p-2 shadow-[0_9px_26px_rgba(61,35,81,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-[#d6b5ef] hover:shadow-[0_16px_38px_rgba(104,63,139,0.13)] sm:rounded-[1.9rem] sm:p-2.5"
    >
      <div className={"relative flex aspect-[1.2/1] min-h-0 items-center justify-center overflow-hidden rounded-[1.1rem] bg-gradient-to-br sm:rounded-[1.45rem] " + accent}>
        <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full border-[12px] border-white/40" aria-hidden="true" />
        <span className="absolute -bottom-7 -right-5 h-24 w-24 rounded-full border-[12px] border-white/35" aria-hidden="true" />
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            loading="lazy"
            className="relative z-10 h-full w-full object-contain p-2 drop-shadow-[0_8px_14px_rgba(60,37,73,0.08)] transition-transform duration-500 group-hover:scale-[1.045] sm:p-3"
          />
        ) : (
          <div className="relative z-10 flex h-full w-full items-center justify-center">
            <CategoryArtwork slug={slug} name={category.name} />
          </div>
        )}
        <span className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#7542ac] opacity-0 shadow-md transition group-hover:opacity-100 sm:right-3 sm:top-3">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-2 pb-3 pt-4 sm:px-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-black leading-snug text-[#38294d] transition group-hover:text-[#8147c8] sm:text-lg">{category.name}</h3>
          <Sparkles className="mt-0.5 hidden h-4 w-4 shrink-0 text-[#e8a651] sm:block" />
        </div>
        {category.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#786b81] sm:text-sm">{category.description}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-extrabold text-[#824bbd] sm:text-sm">
          {category.pageCount === undefined ? "Browse pictures" : category.pageCount === 0 ? "Coming soon" : `${category.pageCount} ${category.pageCount === 1 ? "picture" : "pictures"}`} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
