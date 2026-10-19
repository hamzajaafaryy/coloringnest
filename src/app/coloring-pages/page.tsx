import CategoryCard from "@/components/CategoryCard";
import ColoringGrid from "@/components/ColoringGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchBar from "@/components/SearchBar";
import { curatedColoringCards } from "@/lib/data/curatedColoring";
import AdPlaceholder from "@/components/AdPlaceholder";

export const dynamic = "force-dynamic";

import {
  getAllPublishedCategories,
  getAllPublishedColoringPagesWithCategory,
} from "@/db/queries";

import {
  constructMetadata,
  generateBreadcrumbSchema,
} from "@/lib/seo";

export const metadata = constructMetadata({
  title: "All Free Coloring Pages & Categories",
  description:
    "Browse free online coloring pages organized by category: Unicorns, Dinosaurs, Animals, Princesses, Vehicles, Holidays, Mandalas, and more.",
  path: "/coloring-pages/",
});

export default async function ColoringPagesDirectoryPage() {
  const [categories, pages] = await Promise.all([
    getAllPublishedCategories(),
    getAllPublishedColoringPagesWithCategory(),
  ]);

  const breadcrumbItems = [
    {
      label: "Coloring Pages",
      href: "/coloring-pages/",
    },
  ];

  const breadcrumbSchema =
    generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Free Coloring Pages & Categories
        </h1>

        <p className="text-slate-600 text-base leading-relaxed">
          Welcome to the complete CraftColoring collection! Pick a
          category below to find free coloring pages, or color any
          page directly online in your web browser.
        </p>

        <div className="pt-2 max-w-xl">
          <SearchBar
            placeholder="Search all coloring pages..."
            size="md"
          />
        </div>
      </div>

      <section id="public-domain" aria-label="New public-domain coloring pages" className="scroll-mt-28 space-y-5 rounded-[2rem] bg-gradient-to-br from-violet-50 via-white to-emerald-50 px-4 py-7 sm:px-7">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black uppercase text-emerald-800">New · CC0 public domain</span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">10 fresh, watermark-free coloring drawings</h2>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">We've collected ten printable SVG line-art drawings from Openclipart's public-domain collection. They are hosted locally, ready to download, print or color online. Attribution and original source links are available on each artwork's page.</p>
        <ColoringGrid pages={curatedColoringCards()} />
      </section>

      {/* All Categories Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Coloring Categories
        </h2>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">
              No categories found.
            </p>
          </div>
        )}
      </section>

      <AdPlaceholder
        slotName="Directory Banner"
        format="horizontal"
      />

      {/* Featured Coloring Pages */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Featured Coloring Pages
        </h2>

        <ColoringGrid pages={pages} />
      </section>
    </div>
  );
}