import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Palette, Printer, Sparkles } from "lucide-react";

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

function displayCategoryName(name: string) {
  return /coloring pages/i.test(name) ? name : `${name} Coloring Pages`;
}

export async function generateStaticParams() {
  const categories = await getAllPublishedCategories();

  return categories
    .filter((category) => category.slug)
    .map((category) => ({
      category: category.slug!,
    }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const cat = await getCategoryBySlugFromDb(slug);

  if (!cat) {
    return constructMetadata({
      title: "Category Not Found",
      noindex: true,
    });
  }

  const categoryName = displayCategoryName(cat.name);

  return constructMetadata({
    title:
      cat.seoTitle ||
      `Free ${categoryName} - Print & Color Online`,
    description:
      cat.seoDescription ||
      cat.description ||
      `Explore free ${cat.name.toLowerCase()} coloring pages for kids. Choose a design to color online in your browser or open a printable page for home and classroom activities.`,
    path: `/coloring-pages/${cat.slug}/`,
    image: cat.imageUrl || undefined,
    imageAlt: `${categoryName} for kids`,
  });
}

export default async function CategoryDetailPage({
  params,
}: CategoryPageProps) {
  const { category: slug } = await params;
  const cat = await getCategoryBySlugFromDb(slug);

  if (!cat) {
    notFound();
  }

  const [categoryPages, categoryFaqs, allCategories] = await Promise.all([
    getPublishedColoringPagesByCategorySlug(slug),
    getCategoryFaqs(cat.id),
    getAllPublishedCategories(),
  ]);

  const relatedCategories = allCategories
    .filter((category) => category.slug !== cat.slug)
    .filter((category) => category.popular || category.featured)
    .slice(0, 6);

  const categoryName = displayCategoryName(cat.name);

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

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const faqItems = categoryFaqs
    .filter((faq) => faq.question && faq.answer)
    .map((faq) => ({
      question: faq.question!,
      answer: faq.answer!,
    }));

  const faqSchema =
    faqItems.length > 0 ? generateFAQSchema(faqItems) : null;

  return (
    <div className="mx-auto max-w-7xl space-y-9 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      <Breadcrumbs items={breadcrumbItems} />

      <section className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-[#edf4fb] p-5 shadow-[0_20px_50px_rgba(76,29,149,0.08)] sm:p-9 lg:p-11">

        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wider text-blue-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              Free kids coloring collection
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {categoryName}
            </h1>

            <p className="mt-4 max-w-3xl text-sm font-medium leading-6 text-slate-600 sm:text-lg sm:leading-8">
              {cat.description ||
                `Explore fun ${cat.name.toLowerCase()} designs for kids. Choose a page to color online or print it for crayons, pencils, and markers.`}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-black">
              <span className="rounded-full bg-white px-3 py-2 text-blue-700 shadow-sm ring-1 ring-blue-100">
                {categoryPages.length} {categoryPages.length === 1 ? "page" : "pages"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-slate-700 shadow-sm ring-1 ring-slate-100">
                <Palette className="h-3.5 w-3.5 text-orange-500" />
                Color online
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-slate-700 shadow-sm ring-1 ring-slate-100">
                <Printer className="h-3.5 w-3.5 text-orange-500" />
                Print at home
              </span>
            </div>
          </div>

          <Link
            href="/color-online/"
            className="cc-btn cc-btn-primary relative w-full px-6 lg:w-auto"
          >
            <Palette className="h-5 w-5" />
            Open coloring studio
          </Link>
        </div>

        {cat.subcategories && cat.subcategories.length > 0 && (
          <div className="relative mt-6 border-t border-blue-100 pt-5">
            <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">
              Popular ideas
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.subcategories.map((sub, index) => (
                <span
                  key={`${sub}-${index}`}
                  className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-100"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="max-w-2xl">
        <SearchBar
          placeholder={`Search ${cat.name.toLowerCase()} pages...`}
          size="md"
        />
      </div>

      <AdPlaceholder
        slotName={`${cat.name} Category Top Banner`}
        format="horizontal"
      />

      <section aria-labelledby="category-pages-heading">
        <div className="mb-6">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-blue-500">
            Pick your favorite
          </span>
          <h2
            id="category-pages-heading"
            className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl"
          >
            Free {categoryName}
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
            Open any design for a bigger preview, online coloring tools, printing, and downloading options.
          </p>
        </div>

        <ColoringGrid
          pages={categoryPages}
          emptyMessage={`No ${cat.name.toLowerCase()} coloring pages are available yet. Check back soon!`}
        />
      </section>

      {faqItems.length > 0 && (
        <FAQ items={faqItems} title={`${cat.name} Coloring Page Questions`} />
      )}

      {relatedCategories.length > 0 && (
        <section className="border-t border-blue-100 pt-8">
          <div className="mb-5">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-sky-500">
              Keep exploring
            </span>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              More coloring themes for kids
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {relatedCategories.map((relatedCategory) => (
              <Link
                key={relatedCategory.slug ?? relatedCategory.id}
                href={`/coloring-pages/${relatedCategory.slug}/`}
                className="group flex min-h-24 flex-col justify-between rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:shadow-md"
              >
                <span className="text-sm font-black leading-tight text-slate-900 group-hover:text-blue-700">
                  {relatedCategory.name.replace(/Coloring Pages/gi, "").trim()}
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-blue-600">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
