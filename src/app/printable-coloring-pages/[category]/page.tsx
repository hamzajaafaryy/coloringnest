import { notFound } from "next/navigation";
import ColoringGrid from "@/components/ColoringGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdPlaceholder from "@/components/AdPlaceholder";
import { getCategoryBySlug, CATEGORIES } from "@/lib/data/categories";
import { getPagesByCategory, COLORING_PAGES } from "@/lib/data/coloringPages";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

interface PrintableCategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    category: c.slug,
  }));
}

export async function generateMetadata({ params }: PrintableCategoryPageProps) {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);

  if (!cat) {
    return constructMetadata({ title: "Printable Category Not Found", noindex: true });
  }

  return constructMetadata({
    title: `Printable ${cat.name} (Free PNG & PDF)`,
    description: `Free printable ${cat.name.toLowerCase()} for kids and adults. Download high resolution coloring sheets or print directly from your browser.`,
    path: `/printable-coloring-pages/${cat.slug}/`,
  });
}

export default async function PrintableCategoryPage({ params }: PrintableCategoryPageProps) {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);

  if (!cat) {
    notFound();
  }

  const categoryPages = getPagesByCategory(slug);
  const displayPages = categoryPages.length > 0 ? categoryPages : COLORING_PAGES.slice(0, 8);

  const breadcrumbItems = [
    { label: "Printable Pages", href: "/printable-coloring-pages/" },
    { label: cat.name, href: `/printable-coloring-pages/${cat.slug}/` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <section className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Printable {cat.name}
        </h1>
        <p className="text-slate-300 text-base max-w-3xl leading-relaxed">
          Explore our printable collection of {cat.name.toLowerCase()}. Ready to print on standard Letter or A4 paper size.
        </p>
      </section>

      <AdPlaceholder slotName="Printable Category Banner" format="horizontal" />

      <section className="space-y-6">
        <ColoringGrid pages={displayPages} />
      </section>
    </div>
  );
}
