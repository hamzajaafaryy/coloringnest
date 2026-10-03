import { notFound } from "next/navigation";
import Link from "next/link";

import { Download, CheckCircle2, FileImage, Sparkles } from "lucide-react";

import Breadcrumbs from "@/components/Breadcrumbs";
import DownloadButton from "@/components/DownloadButton";
import PrintButton from "@/components/PrintButton";
import AdPlaceholder from "@/components/AdPlaceholder";
import SocialShare from "@/components/SocialShare";
import { sanitizeSvg } from "@/lib/sanitize-svg";

import {
  getAllPublishedColoringPagesWithCategory,
  getColoringPageByCategoryAndSlug,
} from "@/db/queries";

import {
  constructMetadata,
  generateBreadcrumbSchema,
  generateImageObjectSchema,
} from "@/lib/seo";

interface PrintablePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getAllPublishedColoringPagesWithCategory();

  return pages
    .filter((page) => page.categorySlug && page.slug)
    .map((page) => ({
      category: page.categorySlug!,
      slug: page.slug!,
    }));
}

export async function generateMetadata({ params }: PrintablePageProps) {
  const { category, slug } = await params;
  const page = await getColoringPageByCategoryAndSlug(category, slug);

  if (!page) {
    return constructMetadata({
      title: "Printable Coloring Page Not Found",
      noindex: true,
    });
  }

  return constructMetadata({
    title: page.seoTitle
      ? `Printable ${page.seoTitle}`
      : `Printable ${page.title} Coloring Sheet`,
    description:
      `Download and print this free ${page.title.toLowerCase()} coloring sheet. High-resolution black-and-white line art for home, school, and creative activities.`,
    path: `/printable-coloring-pages/${category}/${slug}/`,
  });
}

export default async function PrintablePage({ params }: PrintablePageProps) {
  const { category, slug } = await params;
  const page = await getColoringPageByCategoryAndSlug(category, slug);

  if (!page) notFound();

  const categoryName = page.categoryName || category;
  const categorySlug = page.categorySlug || category;

  const safeSvgContent = page.svgContent
    ? (() => {
        try {
          return sanitizeSvg(page.svgContent);
        } catch {
          return "";
        }
      })()
    : "";

  const imageUrl = page.imageUrl || `https://craftcoloring.com/images/${page.slug}.png`;

  const breadcrumbItems = [
    { label: "Printable Pages", href: "/printable-coloring-pages/" },
    {
      label: categoryName,
      href: `/printable-coloring-pages/${categorySlug}/`,
    },
    {
      label: page.title,
      href: `/printable-coloring-pages/${categorySlug}/${page.slug}/`,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const imageSchema = generateImageObjectSchema({
    title: `Printable ${page.title} Coloring Sheet`,
    description:
      `Free printable ${page.title.toLowerCase()} coloring sheet for kids and adults.`,
    url: imageUrl,
    category: categoryName,
  });

  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-8 max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-orange-700">
          <FileImage className="h-3.5 w-3.5" />
          Printable Coloring Sheet
        </span>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Printable {page.title} Coloring Sheet
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Download this free printable {page.title.toLowerCase()} coloring sheet and enjoy
          a simple paper coloring activity at home, in the classroom, or during creative time.
          It is designed for clean printing on A4 and US Letter paper.
        </p>
      </header>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-[2rem] border border-orange-100 bg-[#f7f4ee] p-5 shadow-[0_20px_60px_rgba(234,88,12,0.08)] sm:p-8">
          <figure className="rounded-2xl border border-slate-200 bg-white p-4 shadow-inner sm:p-7">
            {safeSvgContent ? (
              <div
                className="flex aspect-[8.5/11] w-full items-center justify-center overflow-hidden [&>svg]:h-full [&>svg]:w-full [&>svg]:max-h-full [&>svg]:max-w-full"
                dangerouslySetInnerHTML={{ __html: safeSvgContent }}
              />
            ) : page.imageUrl ? (
              <img
                src={page.imageUrl}
                alt={page.altText || `Printable ${page.title} coloring sheet`}
                className="aspect-[8.5/11] h-auto w-full object-contain"
              />
            ) : (
              <div className="flex aspect-[8.5/11] items-center justify-center text-sm text-slate-400">
                Printable artwork unavailable.
              </div>
            )}
          </figure>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-500">
            <span className="rounded-full bg-white px-3 py-1.5">A4 friendly</span>
            <span className="rounded-full bg-white px-3 py-1.5">US Letter friendly</span>
            <span className="rounded-full bg-white px-3 py-1.5">Black & white line art</span>
          </div>
        </div>

        <aside className="lg:col-span-5 rounded-[2rem] border border-orange-100 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] sm:p-7">
          <div className="rounded-2xl bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-orange-700">
              Ready for paper
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Print it. Color it. Enjoy it.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Save the printable PNG to your device, or print the sheet directly from your browser.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {safeSvgContent ? (
              <DownloadButton
                slug={page.slug!}
                svgContent={safeSvgContent}
                title={page.title}
              />
            ) : page.imageUrl ? (
              <a
                href={page.imageUrl}
                download
                className="cc-btn cc-btn-dark w-full min-h-12 px-4 py-3.5"
              >
                <Download className="h-4 w-4" />
                Download Printable Image
              </a>
            ) : null}

            <div id="print">
              <PrintButton title={page.title} />
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <div>
                <p className="text-sm font-black text-slate-900">Simple printable format</p>
                <p className="text-xs leading-5 text-slate-500">Clean line art made for crayons, pencils, and markers.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <div>
                <p className="text-sm font-black text-slate-900">No coloring editor here</p>
                <p className="text-xs leading-5 text-slate-500">This page is focused only on downloading and printing.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <div>
                <p className="text-sm font-black text-slate-900">Free creative activity</p>
                <p className="text-xs leading-5 text-slate-500">Useful for home activities, classrooms, and quiet creative time.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-10">
        <SocialShare title={`Printable ${page.title} Coloring Sheet`} imageUrl={imageUrl} />
      </div>

      <AdPlaceholder slotName="Printable Detail Banner" format="horizontal" />

      <section className="mt-10 max-w-4xl space-y-6 text-slate-700">
        <div>
          <h2 className="text-2xl font-black text-slate-900">About this printable coloring sheet</h2>
          <p className="mt-3 text-sm leading-7 sm:text-base">
            {page.description} This printable {page.title.toLowerCase()} sheet is designed for
            traditional coloring with crayons, colored pencils, or markers. Download it as a
            high-resolution PNG and print it at home or school.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">How to download and print</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 sm:text-base">
            <li>Click <strong>Download Printable PNG</strong> to save the sheet.</li>
            <li>Open the downloaded PNG and print it on A4 or US Letter paper.</li>
            <li>Use crayons, pencils, markers, or your favorite coloring tools.</li>
          </ol>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
          <p className="flex items-center gap-2 text-sm font-black text-orange-800">
            <Sparkles className="h-4 w-4" />
            Tip
          </p>
          <p className="mt-2 text-sm leading-6 text-orange-900/80">
            For the cleanest print, choose the highest quality available in your printer settings
            and keep the page centered on the paper.
          </p>
        </div>
      </section>
    </article>
  );
}