import { notFound } from "next/navigation";
import Link from "next/link";

import {
  Sparkles,
  ShieldCheck,
  Heart,
  Palette,
  Printer,
  Download,
  BookOpen,
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
} from "@/lib/seo";

// Preserve authored paragraphs; make legacy single-block descriptions readable.
function descriptionParagraphs(description: string) {
  const paragraphs = description.trim().split(/\n\s*\n/).filter(Boolean);
  if (paragraphs.length !== 1) return paragraphs;

  const sentences = new Intl.Segmenter("en", { granularity: "sentence" }).segment(paragraphs[0]);
  const result: string[] = [];
  let paragraph = "";
  for (const { segment } of sentences) {
    paragraph += segment;
    if (paragraph.trim().split(/\s+/).length >= 55) {
      result.push(paragraph.trim());
      paragraph = "";
    }
  }
  if (paragraph.trim()) result.push(paragraph.trim());
  return result;
}

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
      `${page.title} Coloring Page Online`,

    description:
      page.seoDescription ||
      page.description ||
      `Color ${page.title} online for free in your browser. Explore the interactive coloring tools and creative features on this page.`,

    path: `/coloring-pages/${category}/${slug}/`,
    image: page.imageUrl || undefined,
    imageAlt: page.altText || `${page.title} coloring page for kids`,
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

      </header>

      {/* Artwork + Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Artwork */}
        <div className="md:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <figure className="w-full aspect-square max-w-md bg-white rounded-2xl p-4 shadow-inner border border-slate-100 flex items-center justify-center overflow-hidden">
            {safeSvgContent ? (
              <div
                className="w-full h-full flex items-center justify-center select-none overflow-hidden [&>svg]:block [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-full [&>svg]:h-full"
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
                className="cc-media h-full max-h-full object-contain"
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
            Original artwork preview • open the interactive editor to color it your way.
          </p>
        </div>

        {/* Action Panel */}
        <div className="md:col-span-5 space-y-5 bg-gradient-to-b from-violet-50 via-white to-fuchsia-50 p-6 rounded-3xl border border-violet-100 shadow-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-violet-700">
            <Sparkles className="h-3.5 w-3.5" /> Creative Studio
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            Make this page yours
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Choose your colors, experiment, undo, and create a version that is uniquely yours.
          </p>

          <div className="space-y-3">
            <Link
              href={`/color-online/${page.slug}/`}
              className="cc-btn cc-btn-primary w-full min-h-12 px-4 py-3.5 text-sm sm:text-base"
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

            <div id="print">
              <PrintButton title={page.title} />
            </div>
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

      {/* Reading content */}
      <section className="space-y-6 text-slate-700" aria-label="About this coloring page and how to use it">
        {page.description?.trim() && (
          <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
            <div className="flex items-start gap-3 border-b border-blue-100 bg-[#edf5ff] px-5 py-5 sm:px-8">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700" aria-hidden="true">
                <BookOpen className="h-5 w-5" />
              </span>
              <h2 className="cc-safe-wrap pt-1 text-xl font-black leading-snug text-slate-900 sm:text-2xl">
                About {page.title}
              </h2>
            </div>
            <div className="mx-auto max-w-3xl space-y-5 px-5 py-6 sm:px-8 sm:py-8">
              {descriptionParagraphs(page.description).map((paragraph, index) => (
                <p key={index} className="cc-safe-wrap whitespace-pre-line text-base leading-8 first:font-medium first:text-slate-900">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-amber-100 bg-[#fffcf4] p-5 sm:p-8">
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
            Ready to start coloring?
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Choose the way you want to color.</p>
          <ol className={`mt-5 grid gap-4 ${safeSvgContent ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            <li className="min-w-0 rounded-2xl border border-blue-100 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <Palette className="h-6 w-6 text-blue-700" aria-hidden="true" />
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-700" aria-hidden="true">1</span>
              </div>
              <h3 className="font-bold text-slate-900">Color online</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Select “Color This Page Online” above to open the coloring tools in your browser.</p>
            </li>
            <li className="min-w-0 rounded-2xl border border-orange-100 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <Printer className="h-6 w-6 text-orange-700" aria-hidden="true" />
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 text-xs font-black text-orange-700" aria-hidden="true">2</span>
              </div>
              <h3 className="font-bold text-slate-900">Print at home</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Select “Print Coloring Sheet” above, then choose your printer and paper settings.</p>
            </li>
            {safeSvgContent && (
              <li className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                  <Download className="h-6 w-6 text-emerald-700" aria-hidden="true" />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-700" aria-hidden="true">3</span>
                </div>
                <h3 className="font-bold text-slate-900">Save for later</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Use the download button above to save the artwork to your device.</p>
              </li>
            )}
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