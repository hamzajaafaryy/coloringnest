import Link from "next/link";
import {
  Sparkles,
  Footprints,
  Dog,
  Crown,
  Car,
  Wand2,
  Trees,
  Gift,
  Snowflake,
  Ghost,
  Egg,
  Waves,
  Rocket,
  Pizza,
  Flower2,
  CircleDot,
  Feather,
  Baby,
  BookOpen,
  Trophy,
  Palette,
  ArrowRight,
} from "lucide-react";
import { Category } from "@/lib/data/categories";

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Footprints,
  Dog,
  Crown,
  Car,
  Wand2,
  Trees,
  Gift,
  Snowflake,
  Ghost,
  Egg,
  Waves,
  Rocket,
  Pizza,
  Flower2,
  CircleDot,
  Feather,
  Baby,
  BookOpen,
  Trophy,
  Palette,
};

interface CategoryCardProps {
  category: Category;
  itemCount?: number;
}

export default function CategoryCard({ category, itemCount = 12 }: CategoryCardProps) {
  const IconComponent = iconMap[category.iconName] || Palette;
  const gradientClass = category.heroColor || "from-indigo-50 to-purple-50 border-indigo-100";

  return (
    <Link
      href={`/coloring-pages/${category.slug}/`}
      className={`group relative rounded-2xl p-6 bg-gradient-to-br ${gradientClass} border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between h-full`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 text-slate-700 shadow-2xs">
            {itemCount} pages
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
          {category.name}
        </h3>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-800">
        <span>Explore Category</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
