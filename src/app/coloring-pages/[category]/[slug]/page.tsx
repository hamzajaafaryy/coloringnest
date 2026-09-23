import { notFound } from "next/navigation";
import Link from "next/link";

import {
  Sparkles,
  ShieldCheck,
  Heart,
} from "lucide-react";

import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedColoringPages from "@/components/RelatedColoringPages";
import SocialShare from "@/components/SocialShare";
import FAQ from "@/components/FAQ";
import AdPlaceholder from "@/components/AdPlaceholder";
import DownloadButton from "@/components/DownloadButton";
import PrintButton from "@/components/PrintButton";
import { sanitizeSvg } from "@/lib/sanitize-svg";

import {
  getAllPublishedColoringPagesWithCategory,
  getColoringPageByCategoryAndSlug,
  getColoringPageFaqs,
  getRelatedColoringPages,
} from "@/db/queries";

import {
  constructMetadata,
  generateBreadcrumbSchema,
  generateImageObjectSchema,
  generateFAQSchema,
} from "@/lib/seo";

interface IndividualPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const pages =
    await getAllPublishedColoringPagesWithCategory();

  return pages
    .filter(
      (page) =>
        page.categorySlug &&
        page.slug
    )
    .map((page) => ({
      category: page.categorySlug!,
      slug: page.slug!,
    }));
}

export async function generateMetadata({
  params,
}: IndividualPageProps) {
  const { category, slug } = await params;

  const page =
    await getColoringPageByCategoryAndSlug(
      category,
      slug
    );

  if (!page) {
    return constructMetadata({
      title: "Coloring Page Not Found",
      noindex: true,
    });
  }

  return constructMetadata({
    title:
      page.seoTitle ||
      `${page.title} | Free Printable & Online`,

    description:
      page.seoDescription ||
      page.description ||
      `Color ${page.title} online or print it for free.`,

    path: `/coloring-pages/${category}/${slug}/`,
  });
}

export default async function IndividualColoringPage({
  params,
}: IndividualPageProps) {
  const { category, slug } = await params;

  const page =
    await getColoringPageByCategoryAndSlug(
      category,
      slug
    );

  if (!page) {
    notFound();
  }

  const categoryName =
    page.categoryName || category;

  const categorySlug =
    page.categorySlug || category;

  const relatedPages =
    await getRelatedColoringPages(
      page.id,
      page.categoryId,
      6
    );

  const dbFaqs =
    await getColoringPageFaqs(page.id);

  const pageFaqs =
    dbFaqs.length > 0
      ? dbFaqs
          .filter(
            (faq) =>
              faq.question &&
              faq.answer
          )
          .map((faq) => ({
            question: faq.question!,
            answer: faq.answer!,
          }))
      : [
          {
            question: `Is this ${page.title} free to print?`,
            answer: `Yes! ${page.title} is free to print, download, or color online in your browser.`,
          },
          {
            question: `How can I color ${page.title} online?`,
            answer: `Click the "Color This Page Online" button to open the interactive coloring editor directly in your browser.`,
          },
          {
            question: `How can I download ${page.title}?`,
            answer: `Use the download button on this page to save the coloring artwork to your device.`,
          },
        ];

  const breadcrumbItems = [
    {
      label: "Coloring Pages",
      href: "/coloring-pages/",
    },
    {
      label: categoryName,
      href: `/coloring-pages/${categorySlug}/`,
    },
    {
      label: page.title,
      href: `/coloring-pages/${categorySlug}/${page.slug}/`,
    },
  ];

  const breadcrumbSchema =
    generateBreadcrumbSchema(
      breadcrumbItems
    );

  const safeSvgContent = page.svgContent
    ? (() => {
        try {
          return sanitizeSvg(page.svgContent);
        } catch {
          return "";
        }
      })()
    : "";

  const imageUrl =
    page.imageUrl ||
    `https://craftcoloring.com/images/${page.slug}.png`;

  const imageSchema =
    generateImageObjectSchema({
      title: page.title,
      description:
        page.description || "",
      url: imageUrl,
      category: categoryName,
    });

  const faqSchema =
    generateFAQSchema(pageFaqs);

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbSchema
            ),
        }}
      />

      {/* Image JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              imageSchema
            ),
        }}
      />

      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              faqSchema
            ),
        }}
      />

      <Breadcrumbs
        items={breadcrumbItems}
      />

      {/* Main Header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/coloring-pages/${categorySlug}/`}
            className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
          >
            {categoryName}
          </Link>

          {page.ageRange && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {page.ageRange}
            </span>
          )}

          {page.difficulty && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {page.difficulty} Difficulty
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {page.title}
        </h1>

        {page.description && (
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {page.description}
          </p>
        )}
      </header>

      {/* Artwork + Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Artwork */}
        <div className="md:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <figure className="w-full aspect-square max-w-md bg-white rounded-2xl p-4 shadow-inner border border-slate-100 flex items-center justify-center">
            {safeSvgContent ? (
              <div
                className="w-full h-full flex items-center justify-center select-none"
                dangerouslySetInnerHTML={{
                  __html: safeSvgContent,
                }}
              />
            ) : page.imageUrl ? (
              <img
                src={page.imageUrl}
                alt={
                  page.altText ||
                  page.title
                }
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-sm text-slate-400">
                Coloring artwork unavailable.
              </div>
            )}

            <figcaption className="sr-only">
              {page.altText ||
                page.title}
            </figcaption>
          </figure>

          <p className="text-xs text-slate-400 mt-4 text-center">
            Original crisp vector line art —
            optimized for standard Letter and
            A4 printing.
          </p>
        </div>

        {/* Action Panel */}
        <div className="md:col-span-5 space-y-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Color or Download
          </h2>

          <div className="space-y-3">
            <Link
              href={`/color-online/${page.slug}/`}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base rounded-2xl shadow-md shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Color This Page Online
            </Link>

            {safeSvgContent && (
              <DownloadButton
                slug={page.slug!}
                svgContent={safeSvgContent}
                title={page.title}
              />
            )}

            <PrintButton
              title={page.title}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Free for personal,
                educational, or classroom use
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500 shrink-0" />
              <span>
                No user registration or
                credit card needed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Share */}
      <SocialShare
        title={page.title}
        imageUrl={imageUrl}
      />

      <AdPlaceholder
        slotName="Below Coloring Tools"
        format="horizontal"
      />

      {/* SEO Content */}
      <section className="prose prose-indigo max-w-none space-y-6 pt-4 text-slate-700 leading-relaxed">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            About {page.title}
          </h2>

          <p className="text-sm sm:text-base leading-relaxed">
            {page.description} Kids will
            love coloring the details while
            practicing fine motor skills and
            pencil control. You can color this
            page online in your browser or
            print it for traditional coloring
            with crayons, pencils, or markers.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            How to Color Online or Print at Home
          </h2>

          <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base">
            <li>
              <strong>
                To Color Online:
              </strong>{" "}
              Click the{" "}
              <em>
                &quot;Color This Page Online&quot;
              </em>{" "}
              button to open the interactive
              browser editor.
            </li>

            <li>
              <strong>
                To Print:
              </strong>{" "}
              Click the{" "}
              <em>
                &quot;Print Page&quot;
              </em>{" "}
              button to open the
              printer-friendly dialog.
            </li>

            <li>
              <strong>
                To Download:
              </strong>{" "}
              Click the download button to
              save the coloring artwork to your
              device.
            </li>
          </ol>
        </div>
      </section>

      {/* Tags */}
      {page.tags &&
        page.tags.length > 0 && (
          <div className="pt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Related Tags:
            </span>

            {page.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 px-3 py-1 rounded-full transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

      {/* FAQ */}
      <FAQ
        items={pageFaqs}
        title={`Questions About ${page.title}`}
      />

      {/* Related Pages */}
      <RelatedColoringPages
        pages={relatedPages}
        title={`More ${categoryName}`}
      />
    </article>
  );
}