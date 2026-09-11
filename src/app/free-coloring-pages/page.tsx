import Link from "next/link";
import ColoringGrid from "@/components/ColoringGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryCard from "@/components/CategoryCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import { COLORING_PAGES } from "@/lib/data/coloringPages";
import { CATEGORIES } from "@/lib/data/categories";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "100% Free Coloring Pages for Everyone | ColoringNest",
  description: "Browse 100% free online and printable coloring pages. No subscription, no account required. High quality vector art for kids and adults.",
  path: "/free-coloring-pages/",
});

export default function FreeColoringPagesPage() {
  const breadcrumbItems = [
    { label: "Free Coloring Pages", href: "/free-coloring-pages/" }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <section className="bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 text-white p-8 sm:p-12 rounded-3xl shadow-lg space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-pink-100 bg-white/10 px-3 py-1 rounded-full border border-white/20">
          No Subscription Required
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          100% Free Online & Printable Coloring Pages
        </h1>
        <p className="text-pink-100 text-base sm:text-lg max-w-2xl leading-relaxed">
          At ColoringNest, we believe creativity should be accessible to all kids, parents, and teachers. Enjoy unlimited free downloads and browser coloring.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Featured Free Sheets</h2>
        <ColoringGrid pages={COLORING_PAGES} />
      </section>

      <AdPlaceholder slotName="Free Pages Hub Banner" format="horizontal" />

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Explore All Free Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      </section>
    </div>
  );
}
