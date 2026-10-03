import ColoringGrid from "@/components/ColoringGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryCard from "@/components/CategoryCard";
import AdPlaceholder from "@/components/AdPlaceholder";
import FAQ from "@/components/FAQ";

import {
  getAllPublishedCategories,
  getAllPublishedColoringPagesWithCategory,
} from "@/db/queries";

import {
  constructMetadata,
  generateBreadcrumbSchema,
} from "@/lib/seo";

export const metadata = constructMetadata({
  title:
    "Printable Coloring Pages for Kids & Adults",
  description:
    "Download and print free high-resolution coloring pages. Standard Letter and A4 friendly line art for home, school, and creative activities.",
  path: "/printable-coloring-pages/",
});

const PRINTABLE_FAQS = [
  {
    question: "What paper size is best for printing coloring sheets?",
    answer:
      "Our printable coloring pages are formatted for standard US Letter (8.5 x 11 inches) and international A4 paper sizes.",
  },
  {
    question: "Can teachers print these pages for classroom use?",
    answer:
      "Yes! All printable coloring pages on CraftColoring are 100% free for teachers, homeschoolers, parents, and community programs.",
  },
];

export default async function PrintableColoringPagesPage() {
  const [pages, categories] = await Promise.all([
    getAllPublishedColoringPagesWithCategory(),
    getAllPublishedCategories(),
  ]);

  const breadcrumbItems = [
    {
      label: "Printable Coloring Pages",
      href: "/printable-coloring-pages/",
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

      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-50 via-white to-amber-50 p-8 sm:p-12 shadow-xl ring-1 ring-orange-100">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-orange-200/60 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-yellow-200/70 blur-2xl" />
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/60 px-3 py-1 rounded-full border border-indigo-700">
          Printable Coloring Hub
        </span>

        <h1 className="relative mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Ready-to-print sheets for crayons, pencils & markers
        </h1>

        <p className="relative text-slate-600 text-base sm:text-lg max-w-3xl leading-relaxed">
          Clean black-and-white outlines designed for paper. Choose a sheet, open its print-ready preview, and print on standard Letter or A4 paper.
        </p>

        <div className="relative flex flex-wrap gap-2 pt-2 text-xs font-bold text-slate-700">
          <span className="rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-orange-100">A4 friendly</span>
          <span className="rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-orange-100">US Letter friendly</span>
          <span className="rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-orange-100">Black & white line art</span>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Browse Printables by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
            />
          ))}
        </div>
      </section>

      <AdPlaceholder
        slotName="Printable Hub Banner"
        format="horizontal"
      />

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Featured Printable Sheets</h2>
          <p className="mt-1 text-sm text-slate-500">Pick a sheet to print. Want the interactive experience? Open the same design online.</p>
        </div>

        <ColoringGrid pages={pages} variant="printable" />
      </section>

      <FAQ
        items={PRINTABLE_FAQS}
        title="Printable Coloring FAQ"
      />
    </div>
  );
}