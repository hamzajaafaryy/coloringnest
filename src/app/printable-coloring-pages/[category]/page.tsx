import { notFound } from "next/navigation";

import ColoringGrid from "@/components/ColoringGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdPlaceholder from "@/components/AdPlaceholder";

import {
  getAllPublishedCategories,
  getCategoryBySlugFromDb,
  getPublishedColoringPagesByCategorySlug,
} from "@/db/queries";

import {
  constructMetadata,
  generateBreadcrumbSchema,
} from "@/lib/seo";

interface PrintableCategoryPageProps {
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
}: PrintableCategoryPageProps) {
  const { category: slug } = await params;

  const cat =
    await getCategoryBySlugFromDb(slug);

  if (!cat) {
    return constructMetadata({
      title: "Printable Category Not Found",
      noindex: true,
    });
  }

  const pages =
    await getPublishedColoringPagesByCategorySlug(slug);

  return constructMetadata({
    title:
      cat.seoTitle ||
      `Printable ${cat.name} Coloring Pages`,

    description:
      cat.seoDescription ||
      `Free printable ${cat.name.toLowerCase()} for kids and adults. Download high-resolution PNG coloring sheets or print directly from your browser.`,

    path: `/printable-coloring-pages/${cat.slug}/`,
    noindex: pages.length === 0,
  });
}

/* =========================================================
   PAGE
   ========================================================= */

export default async function PrintableCategoryPage({
  params,
}: PrintableCategoryPageProps) {
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
     Get pages
  ------------------------------------------------------- */

  const displayPages =
    await getPublishedColoringPagesByCategorySlug(
      slug
    );

  /* -------------------------------------------------------
     Breadcrumbs
  ------------------------------------------------------- */

  const breadcrumbItems = [
    {
      label: "Printable Pages",
      href: "/printable-coloring-pages/",
    },
    {
      label: cat.name,
      href: `/printable-coloring-pages/${cat.slug}/`,
    },
  ];

  const breadcrumbSchema =
    generateBreadcrumbSchema(
      breadcrumbItems
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

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

      {/* ===================================================
          BREADCRUMBS
      =================================================== */}

      <Breadcrumbs
        items={breadcrumbItems}
      />

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl space-y-4">

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Printable {cat.name}
        </h1>

        <p className="text-slate-300 text-base max-w-3xl leading-relaxed">
          Explore our printable collection
          of{" "}
          {cat.name.toLowerCase()}.
          Ready to print on standard Letter
          or A4 paper size.
        </p>

      </section>

      {/* ===================================================
          AD
      =================================================== */}

      <AdPlaceholder
        slotName="Printable Category Banner"
        format="horizontal"
      />

      {/* ===================================================
          COLORING GRID
      =================================================== */}

      <section className="space-y-6">

        <ColoringGrid
          pages={displayPages}
        />

      </section>

    </div>
  );
}