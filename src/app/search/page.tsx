import Link from "next/link";

import SearchBar from "@/components/SearchBar";
import ColoringGrid from "@/components/ColoringGrid";
import Breadcrumbs from "@/components/Breadcrumbs";

import {
  getAllPublishedColoringPagesWithCategory,
  getAllPublishedCategories,
} from "@/db/queries";

import { constructMetadata } from "@/lib/seo";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;

  const query = q ? q.trim() : "";

  return constructMetadata({
    title: query
      ? `Search results for "${query}"`
      : "Search Free Coloring Pages",

    description: `Browse free coloring page search results for ${
      query || "kids and adults"
    }. Color online or print for free.`,

    path: `/search${
      query ? `?q=${encodeURIComponent(query)}` : ""
    }`,

    noindex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;

  const query = q ? q.trim().toLowerCase() : "";

  /*
   * Everything now comes from Supabase.
   */
  const [allPages, allCategories] = await Promise.all([
    getAllPublishedColoringPagesWithCategory(),
    getAllPublishedCategories(),
  ]);

  /*
   * Search coloring pages.
   */
  const results = query
    ? allPages.filter((page) => {
        const title = page.title?.toLowerCase() ?? "";
        const description =
          page.description?.toLowerCase() ?? "";
        const categoryName =
          page.categoryName?.toLowerCase() ?? "";
        const categorySlug =
          page.categorySlug?.toLowerCase() ?? "";

        return (
          title.includes(query) ||
          description.includes(query) ||
          categoryName.includes(query) ||
          categorySlug.includes(query)
        );
      })
    : [];

  /*
   * Search categories.
   */
  const matchedCategories = query
    ? allCategories.filter((category) => {
        const name =
          category.name?.toLowerCase() ?? "";

        const description =
          category.description?.toLowerCase() ?? "";

        return (
          name.includes(query) ||
          description.includes(query)
        );
      })
    : [];

  /*
   * When there is no search query,
   * show the first 12 published pages.
   */
  const displayPages = query
    ? results
    : allPages.slice(0, 12);

  const breadcrumbItems = [
    {
      label: "Search",
      href: "/search/",
    },

    ...(query
      ? [
          {
            label: `"${query}"`,
            href: `/search?q=${encodeURIComponent(query)}`,
          },
        ]
      : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {query
            ? `Search Results for "${query}"`
            : "Search Free Coloring Pages"}
        </h1>

        <SearchBar
          placeholder="Search coloring pages..."
          size="lg"
        />
      </div>

      {/* Matched Categories Pills */}
      {matchedCategories.length > 0 && (
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            Matching Categories:
          </span>

          <div className="flex flex-wrap gap-2 pt-1">
            {matchedCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/coloring-pages/${cat.slug}/`}
                className="text-xs bg-white text-indigo-700 font-semibold px-3 py-1.5 rounded-full border border-indigo-200 shadow-2xs hover:bg-indigo-600 hover:text-white transition-colors"
              >
                {cat.name} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          {query
            ? `Found ${results.length} Coloring Pages`
            : "Popular Coloring Pages"}
        </h2>

        <ColoringGrid
          pages={displayPages}
          emptyMessage={`No coloring pages matching "${query}". Try searching for unicorn, dinosaur, cat, or princess.`}
        />
      </section>
    </div>
  );
}