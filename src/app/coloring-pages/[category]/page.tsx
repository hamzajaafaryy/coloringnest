import { notFound } from "next/navigation";
import Link from "next/link";
import ColoringGrid from "@/components/ColoringGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";
import SearchBar from "@/components/SearchBar";
import { getCategoryBySlug, CATEGORIES } from "@/lib/data/categories";
import { getPagesByCategory, COLORING_PAGES } from "@/lib/data/coloringPages";
import { constructMetadata, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    category: c.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);

  if (!cat) {
    return constructMetadata({
      title: "Category Not Found",
      noindex: true,
    });
  }

  return constructMetadata({
    title: cat.seoTitle || `${cat.name} | Free Printable & Online`,
    description: cat.seoDescription || cat.description,
    path: `/coloring-pages/${cat.slug}/`,
  });
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);

  if (!cat) {
    notFound();
  }

  const categoryPages = getPagesByCategory(slug);
  // Fallback: if empty, show general coloring pages
  const displayPages = categoryPages.length > 0 ? categoryPages : COLORING_PAGES.slice(0, 8);

  const breadcrumbItems = [
    { label: "Coloring Pages", href: "/coloring-pages/" },
    { label: cat.name, href: `/coloring-pages/${cat.slug}/` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const faqSchema = cat.faqs ? generateFAQSchema(cat.faqs) : null;

  // Other related categories
  const relatedCategories = CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Breadcrumbs items={breadcrumbItems} />

      {/* Category Hero Banner */}
      <section className={`p-8 sm:p-12 rounded-3xl bg-gradient-to-br ${cat.heroColor || "from-indigo-50 to-purple-50 border-indigo-100"} border shadow-xs space-y-4`}>
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-white/80 px-3 py-1 rounded-full border border-indigo-100">
            Free Printable & Online Category
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {cat.name}
          </h1>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            {cat.description} Choose your favorite design below, color it online in your browser, or print out high quality PNG/PDF sheets for free.
          </p>
        </div>

        {/* Subcategories Pills if available */}
        {cat.subcategories && cat.subcategories.length > 0 && (
          <div className="pt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Popular themes:</span>
            {cat.subcategories.map((sub, i) => (
              <span
                key={i}
                className="text-xs bg-white text-slate-700 px-3 py-1 rounded-full font-medium shadow-2xs border border-slate-200"
              >
                {sub}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Search within Category */}
      <div className="max-w-xl">
        <SearchBar placeholder={`Search in ${cat.name}...`} size="md" />
      </div>

      <AdPlaceholder slotName={`${cat.name} Category Top Banner`} format="horizontal" />

      {/* Main Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Free {cat.name} ({displayPages.length} Pages)
          </h2>
        </div>

        <ColoringGrid
          pages={displayPages}
          emptyMessage={`No coloring pages currently available in ${cat.name}. Check back soon!`}
        />
      </section>

      {/* Category FAQs if available */}
      {cat.faqs && cat.faqs.length > 0 && (
        <FAQ items={cat.faqs} title={`${cat.name} FAQ`} />
      )}

      {/* Related Categories Navigation */}
      <section className="pt-8 border-t border-slate-200 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Explore Related Coloring Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedCategories.map((rc) => (
            <Link
              key={rc.slug}
              href={`/coloring-pages/${rc.slug}/`}
              className="p-4 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-2xl text-center space-y-2 transition-all group"
            >
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 truncate">
                {rc.name.replace("Coloring Pages", "")}
              </h3>
              <span className="text-[11px] text-slate-500 block">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
