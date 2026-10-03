import Link from "next/link";
import { ArrowRight, Palette, Printer, Sparkles } from "lucide-react";

import CategoryCard from "@/components/CategoryCard";
import ColoringGrid from "@/components/ColoringGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";
import AdPlaceholder from "@/components/AdPlaceholder";

import {
  getAllPublishedCategories,
  getAllPublishedColoringPagesWithCategory,
} from "@/db/queries";

import {
  constructMetadata,
  generateBreadcrumbSchema,
} from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Free Coloring Pages for Kids - Browse Themes",
  description:
    "Browse free coloring pages for kids by theme. Explore unicorns, dinosaurs, animals, princesses, holidays and more, then print a page or color it online.",
  path: "/coloring-pages/",
});

export default async function ColoringPagesDirectoryPage() {
  const [categories, pages] = await Promise.all([
    getAllPublishedCategories(),
    getAllPublishedColoringPagesWithCategory(),
  ]);

  const featuredPages = pages.filter((page) => page.featured || page.popular);
  const displayPages = (featuredPages.length ? featuredPages : pages).slice(0, 12);

  const breadcrumbItems = [
    {
      label: "Coloring Pages",
      href: "/coloring-pages/",
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:space-y-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <section className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-5 shadow-[0_20px_50px_rgba(76,29,149,0.08)] sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-pink-200/40 blur-3xl" />

        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wider text-violet-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-500" />
            Pick something fun
          </span>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Free coloring pages for kids
          </h1>

          <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-slate-600 sm:text-lg sm:leading-8">
            Browse fun coloring themes, choose a design, then color it online or
            print it for crayons, pencils and markers.
          </p>

          <div className="mt-5 max-w-2xl">
            <SearchBar
              placeholder="Search unicorns, dinosaurs, animals..."
              size="lg"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-black text-slate-700 shadow-sm ring-1 ring-slate-100">
              <Palette className="h-3.5 w-3.5 text-violet-500" />
              Color online
            </span>
            <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-black text-slate-700 shadow-sm ring-1 ring-slate-100">
              <Printer className="h-3.5 w-3.5 text-orange-500" />
              Print at home
            </span>
            <span className="inline-flex min-h-10 items-center rounded-full bg-white px-3 text-xs font-black text-slate-700 shadow-sm ring-1 ring-slate-100">
              {pages.length} pages
            </span>
          </div>
        </div>
      </section>

      <section aria-labelledby="themes-heading">
        <div className="mb-6">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-sky-500">
            Browse by theme
          </span>
          <h2 id="themes-heading" className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
            Coloring categories
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
            Choose a theme to see matching coloring pages made for creative play.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-violet-100 bg-violet-50/50 py-12 text-center">
            <p className="font-bold text-slate-500">
              New coloring themes are being added.
            </p>
          </div>
        )}
      </section>

      <AdPlaceholder
        slotName="Directory Banner"
        format="horizontal"
      />

      <section aria-labelledby="featured-heading">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-500">
              Easy place to start
            </span>
            <h2 id="featured-heading" className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
              Featured coloring pages
            </h2>
          </div>

          <Link
            href="/color-online/"
            className="hidden min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-black text-violet-600 hover:bg-violet-50 sm:inline-flex"
          >
            Color online
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ColoringGrid pages={displayPages} />
      </section>
    </div>
  );
}
