import ColoringGrid from "@/components/ColoringGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryCard from "@/components/CategoryCard";
import AdPlaceholder from "@/components/AdPlaceholder";

export const dynamic = "force-dynamic";

import {
  getAllPublishedCategories,
  getAllPublishedColoringPagesWithCategory,
} from "@/db/queries";

import {
  constructMetadata,
  generateBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo";

export const metadata = constructMetadata({
  noindex: true,
  title: "100% Free Coloring Pages for Everyone | CraftColoring",
  description:
    "Browse free online coloring pages for kids and adults. No subscription or account is required to explore and color.",
  path: "/free-coloring-pages/",
});

export default async function FreeColoringPagesPage() {
  const [pages, categories] = await Promise.all([
    getAllPublishedColoringPagesWithCategory(),
    getAllPublishedCategories(),
  ]);

  const breadcrumbItems = [
    {
      label: "Free Coloring Pages",
      href: "/free-coloring-pages/",
    },
  ];

  const breadcrumbSchema =
    generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema),
        }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <section className="space-y-4 rounded-3xl border-2 border-[#2b2140] bg-[#4c3176] p-8 text-white shadow-[7px_7px_0_#2b2140] sm:p-12">
        <span className="rounded-full border-2 border-[#2b2140] bg-[#ffd23f] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#2b2140] shadow-[3px_3px_0_#2b2140]">
          No Subscription Required
        </span>

        <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
          100% Free Online Coloring Pages
        </h1>

        <p className="max-w-2xl text-base leading-7 text-white sm:text-lg sm:leading-8">
          At CraftColoring, we believe creativity should be accessible to all
          kids, parents, and teachers. Explore themed collections and
          color directly in your browser.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-[#2b2140]">
          Featured Free Sheets
        </h2>

        <ColoringGrid pages={pages} />
      </section>

      <AdPlaceholder
        slotName="Free Pages Hub Banner"
        format="horizontal"
      />

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-[#2b2140]">
          Explore All Free Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
