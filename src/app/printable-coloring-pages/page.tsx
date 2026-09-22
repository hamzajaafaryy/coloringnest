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
    "Free Printable Coloring Pages for Kids & Adults (PDF & PNG)",
  description:
    "Download and print thousands of free high-resolution printable coloring pages. Standard Letter and A4 size, ink-saving line art for home or school.",
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

      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/60 px-3 py-1 rounded-full border border-indigo-700">
          Printable Coloring Hub
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Free Printable Coloring Pages
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
          Select any design to open the printable preview, click print, or
          save high-definition black-and-white PNG outline files to print at
          home.
        </p>
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
        <h2 className="text-2xl font-bold text-slate-900">
          Featured Printable Sheets
        </h2>

        <ColoringGrid pages={pages} />
      </section>

      <FAQ
        items={PRINTABLE_FAQS}
        title="Printable Coloring FAQ"
      />
    </div>
  );
}