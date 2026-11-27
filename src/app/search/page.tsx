import Link from "next/link";

export const dynamic = "force-dynamic";

import SearchBar from "@/components/SearchBar";
import ColoringGrid from "@/components/ColoringGrid";
import Breadcrumbs from "@/components/Breadcrumbs";

import {
  getAllPublishedCategories,
} from "@/db/queries";

import { constructMetadata } from "@/lib/seo";
import { getPublishedCardPage } from "@/db/page-cards";
import { parsePage } from "@/lib/paging";
import PaginationLinks from "@/components/PaginationLinks";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({}: SearchPageProps) {
  return constructMetadata({
    title: "Search Free Coloring Pages",
    description:
      "Search CraftColoring coloring pages by title, category, or topic.",
    path: "/search/",
    noindex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q, page: pageParam } = await searchParams;

  const query = (q || "").trim().slice(0, 80);

  const [listing, allCategories] = await Promise.all([
    getPublishedCardPage({ query: query || undefined, page: query ? parsePage(pageParam) : 1, limit: query ? 24 : 12 }),
    getAllPublishedCategories(),
  ]);

  const matchedCategories = query
    ? allCategories.filter((category) => {
        const name = category.name?.toLowerCase() ?? "";
        const description = category.description?.toLowerCase() ?? "";

        return Boolean(category.slug) && (
          name.includes(query) ||
          description.includes(query)
        );
      })
    : [];

  const displayPages = listing.pages;

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
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-black tracking-tight text-[#2b2140]">
          {query
            ? `Search Results for "${query}"`
            : "Search Free Coloring Pages"}
        </h1>

        <SearchBar
          key={query}
          initialQuery={q?.trim() || ""}
          placeholder="Search coloring pages..."
          size="lg"
        />
      </div>

      {matchedCategories.length > 0 && (
        <div className="space-y-2 rounded-2xl border-2 border-[#2b2140] bg-[#e8f4ff] p-4 shadow-[4px_4px_0_rgba(43,33,64,0.14)]">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2b2140]">
            Matching Categories:
          </span>

          <div className="flex flex-wrap gap-2 pt-1">
            {matchedCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/coloring-pages/${cat.slug}/`}
                className="inline-flex min-h-11 items-center rounded-full border-2 border-[#2b2140] bg-white px-3 py-1.5 text-xs font-semibold text-[#2b2140] shadow-[3px_3px_0_#2b2140] transition-colors hover:bg-[#ffd23f]"
              >
                {cat.name} →
              </Link>
            ))}
          </div>
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-black text-[#2b2140]">
          {query
            ? `Found ${listing.total} Coloring ${listing.total === 1 ? "Page" : "Pages"}`
            : "Popular Coloring Pages"}
        </h2>

        <ColoringGrid
          pages={displayPages}
          emptyMessage={
            query
              ? `No coloring pages matching "${query}". Try searching for unicorn, dinosaur, cat, or princess.`
              : "Start by searching for a coloring page."
          }
        />
        {query && <PaginationLinks path="/search" page={listing.page} pageCount={listing.pageCount} query={query} />}
      </section>
    </div>
  );
}
