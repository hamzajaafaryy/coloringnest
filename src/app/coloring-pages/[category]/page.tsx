import { notFound } from "next/navigation";

import Link from "next/link";

import ColoringGrid from "@/components/ColoringGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";
import SearchBar from "@/components/SearchBar";

import {
  getAllPublishedCategories,
  getCategoryBySlugFromDb,
  getCategoryFaqs,
  getPublishedColoringPagesByCategorySlug,
} from "@/db/queries";

import {
  constructMetadata,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

/* =========================================================
   STATIC PARAMS
   ========================================================= */

export async function generateStaticParams() {
  const categories =
    await getAllPublishedCategories();

  return categories
    .filter((category) => category.slug)
    .map((category) => ({
      category: category.slug!,
    }));
}

/* =========================================================
   METADATA
   ========================================================= */

export async function generateMetadata({
  params,
}: CategoryPageProps) {
  const { category: slug } = await params;

  const cat =
    await getCategoryBySlugFromDb(slug);

  if (!cat) {
    return constructMetadata({
      title: "Category Not Found",
      noindex: true,
    });
  }

  return constructMetadata({
    title:
      cat.seoTitle ||
      `${cat.name} | Free Printable & Online`,

    description:
      cat.seoDescription ||
      cat.description ||
      undefined,

    path: `/coloring-pages/${cat.slug}/`,
  });
}

/* =========================================================
   PAGE
   ========================================================= */

export default async function CategoryDetailPage({
  params,
}: CategoryPageProps) {
  const { category: slug } = await params;

  /* -------------------------------------------------------
     Get category from DB
  ------------------------------------------------------- */

  const cat =
    await getCategoryBySlugFromDb(slug);

  if (!cat) {
    notFound();
  }

  /* -------------------------------------------------------
     Get category pages + FAQs
  ------------------------------------------------------- */

  const [
    categoryPages,
    categoryFaqs,
    allCategories,
  ] = await Promise.all([
    getPublishedColoringPagesByCategorySlug(
      slug
    ),

    getCategoryFaqs(cat.id),

    getAllPublishedCategories(),
  ]);

  /* -------------------------------------------------------
     Related categories
  ------------------------------------------------------- */

  const relatedCategories =
    allCategories
      .filter(
        (category) =>
          category.slug !== cat.slug
      )
      .filter(
        (category) =>
          category.popular ||
          category.featured
      )
      .slice(0, 6);

  /* -------------------------------------------------------
     Breadcrumbs
  ------------------------------------------------------- */

  const breadcrumbItems = [
    {
      label: "Coloring Pages",
      href: "/coloring-pages/",
    },
    {
      label: cat.name,
      href: `/coloring-pages/${cat.slug}/`,
    },
  ];

  const breadcrumbSchema =
    generateBreadcrumbSchema(
      breadcrumbItems
    );

  /* -------------------------------------------------------
     FAQ Schema
  ------------------------------------------------------- */

  const faqItems = categoryFaqs
    .filter(
      (faq) =>
        faq.question &&
        faq.answer
    )
    .map((faq) => ({
      question: faq.question!,
      answer: faq.answer!,
    }));

  const faqSchema =
    faqItems.length > 0
      ? generateFAQSchema(faqItems)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

      {/* ===================================================
          STRUCTURED DATA
      =================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbSchema
            ),
        }}
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                faqSchema
              ),
          }}
        />
      )}

      {/* ===================================================
          BREADCRUMBS
      =================================================== */}

      <Breadcrumbs
        items={breadcrumbItems}
      />

      {/* ===================================================
          CATEGORY HERO
      =================================================== */}

      <section
        className={`p-8 sm:p-12 rounded-3xl bg-gradient-to-br ${
          cat.heroColor ||
          "from-indigo-50 to-purple-50 border-indigo-100"
        } border shadow-xs space-y-4`}
      >
        <div className="max-w-3xl space-y-3">

          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-white/80 px-3 py-1 rounded-full border border-indigo-100">
            Free Printable & Online Category
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {cat.name}
          </h1>

          <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
            {cat.description} Choose your
            favorite design below, color it
            online in your browser, or print
            out high quality PNG sheets
            for free.
          </p>

        </div>

        {/* =================================================
            SUBCATEGORIES
        ================================================= */}

        {cat.subcategories &&
          cat.subcategories.length > 0 && (
            <div className="pt-3 flex flex-wrap items-center gap-2">

              <span className="text-xs font-semibold text-slate-500">
                Popular themes:
              </span>

              {cat.subcategories.map(
                (sub, index) => (
                  <span
                    key={`${sub}-${index}`}
                    className="text-xs bg-white text-slate-700 px-3 py-1 rounded-full font-medium shadow-2xs border border-slate-200"
                  >
                    {sub}
                  </span>
                )
              )}

            </div>
          )}

      </section>

      {/* ===================================================
          SEARCH
      =================================================== */}

      <div className="max-w-xl">
        <SearchBar
          placeholder={`Search in ${cat.name}...`}
          size="md"
        />
      </div>

      {/* ===================================================
          AD
      =================================================== */}

      <AdPlaceholder
        slotName={`${cat.name} Category Top Banner`}
        format="horizontal"
      />

      {/* ===================================================
          MAIN GRID
      =================================================== */}

      <section className="space-y-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold text-slate-900">
            Free {cat.name} (
            {categoryPages.length} Pages)
          </h2>

        </div>

        <ColoringGrid
          pages={categoryPages}
          emptyMessage={`No coloring pages currently available in ${cat.name}. Check back soon!`}
        />

      </section>

      {/* ===================================================
          CATEGORY FAQS
      =================================================== */}

      {faqItems.length > 0 && (
        <FAQ
          items={faqItems}
          title={`${cat.name} FAQ`}
        />
      )}

      {/* ===================================================
          RELATED CATEGORIES
      =================================================== */}

      {relatedCategories.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-6">

          <h2 className="text-2xl font-bold text-slate-900">
            Explore Related Coloring Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

            {relatedCategories.map(
              (relatedCategory) => (
                <Link
                  key={
                    relatedCategory.slug ??
                    relatedCategory.id
                  }
                  href={`/coloring-pages/${relatedCategory.slug}/`}
                  className="p-4 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-2xl text-center space-y-2 transition-all group"
                >
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 truncate">
                    {relatedCategory.name.replace(
                      "Coloring Pages",
                      ""
                    )}
                  </h3>

                  <span className="text-[11px] text-slate-500 block">
                    Explore →
                  </span>
                </Link>
              )
            )}

          </div>

        </section>
      )}

    </div>
  );
}