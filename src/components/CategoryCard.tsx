import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryCardCategory {
  id: string | number;
  name: string;
  slug: string | null;
  description?: string | null;
  imageUrl?: string | null;
}

interface CategoryCardProps {
  category: CategoryCardCategory;
}

export default function CategoryCard({
  category,
}: CategoryCardProps) {
  const slug = category.slug ?? "coloring-pages";
  const description = category.description ?? "";
  const imageUrl = category.imageUrl ?? null;

  return (
    <Link
      href={`/coloring-pages/${slug}/`}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
            <span className="text-4xl font-extrabold text-indigo-200">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
            {category.name}
          </h3>

          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0" />
        </div>

        {description && (
          <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}