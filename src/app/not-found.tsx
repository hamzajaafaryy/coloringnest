import Link from "next/link";
import { Palette, Search, ArrowLeft } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import ColoringGrid from "@/components/ColoringGrid";
import CategoryCard from "@/components/CategoryCard";
import { COLORING_PAGES } from "@/lib/data/coloringPages";
import { CATEGORIES } from "@/lib/data/categories";

export default function NotFound() {
  const popularPages = COLORING_PAGES.slice(0, 4);
  const featuredCategories = CATEGORIES.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-center">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
          <Palette className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Oops! Coloring Page Not Found
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          We couldn&apos;t find the page you were looking for. It might have moved, or you can search our library below:
        </p>

        <div className="pt-2 max-w-md mx-auto">
          <SearchBar placeholder="Search coloring pages..." size="md" />
        </div>

        <div className="pt-4">
          <Link
            href="/coloring-pages/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-md hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Coloring Pages
          </Link>
        </div>
      </div>

      {/* Recommended Categories */}
      <section className="space-y-6 text-left">
        <h2 className="text-2xl font-bold text-slate-900 text-center">
          Explore Popular Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCategories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>

      {/* Recommended Pages */}
      <section className="space-y-6 text-left">
        <h2 className="text-2xl font-bold text-slate-900 text-center">
          Try These Popular Coloring Pages
        </h2>
        <ColoringGrid pages={popularPages} />
      </section>
    </div>
  );
}
