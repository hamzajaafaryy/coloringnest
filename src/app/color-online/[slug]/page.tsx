import { getAdditionalSheets } from "@/db/coloring-sheets";
import { primarySheet, sheetEditorUrl, type ColoringSheet } from "@/lib/coloring-sheets";
import { sanitizeSvg } from "@/lib/sanitize-svg";
import { notFound } from "next/navigation";
import Link from "next/link";

import Breadcrumbs from "@/components/Breadcrumbs";
import ColoringEditor from "@/components/ColoringEditor";
import { loadColoringSvg } from "@/lib/coloring/loadSvg";
import RelatedColoringPages from "@/components/RelatedColoringPages";

import {
  getColoringPageBySlug,
  getRelatedColoringPages,
} from "@/db/queries";

import {
  constructMetadata,
  generateBreadcrumbSchema,
  serializeJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

interface ColorOnlinePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sheet?: string | string[] }>;
}



export async function generateMetadata({
  params, searchParams,
}: ColorOnlinePageProps) {
  const { slug } = await params;

  const page = await getColoringPageBySlug(slug);

  if (!page) notFound();

  return constructMetadata({
    title: `Color Online: ${page.title}`,
    description: `Color ${page.title} online for free directly in your browser. Use touch and click-to-fill tools, color palette, brush, undo, and instant PNG download.`,
    path: `/color-online/${slug}/`,
    noindex: Boolean((await searchParams).sheet),
  });
}

export default async function ColorOnlinePage({
  params, searchParams,
}: ColorOnlinePageProps) {
  const { slug } = await params;

  const page = await getColoringPageBySlug(slug);

  if (!page) {
    notFound();
  }

  if (!page.slug || !page.categorySlug) {
    notFound();
  }

  const sheets: ColoringSheet[] = [primarySheet(page), ...await getAdditionalSheets(page.id)];
  const selection = (await searchParams).sheet;
  if (Array.isArray(selection)) notFound();
  const selectedIndex = selection ? sheets.findIndex(sheet => sheet.id === selection) : 0;
  if (selectedIndex < 0) notFound();
  const selected = sheets[selectedIndex];
  let svgContent = "";
  try { svgContent = selected.svgContent ? sanitizeSvg(selected.svgContent) : await loadColoringSvg(selected.svgUrl); } catch { /* Raster artwork remains usable. */ }


  const relatedPages = await getRelatedColoringPages(
    page.id,
    page.categoryId,
    6
  );

  const breadcrumbItems = [
    {
      label: "Coloring Pages",
      href: "/coloring-pages/",
    },
    {
      label: page.categoryName || page.categorySlug,
      href: `/coloring-pages/${page.categorySlug}/`,
    },
    {
      label: page.title,
      href: `/coloring-pages/${page.categorySlug}/${page.slug}/`,
    },
    {
      label: "Color Online",
      href: `/color-online/${page.slug}/`,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema),
        }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Browser Interactive Editor
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Color Online: {selected.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/coloring-pages/${page.categorySlug}/${page.slug}/`}
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 underline"
          >
            View Print & Download Page →
          </Link>
        </div>
      </div>

      {sheets.length > 1 && <nav aria-label="Collection drawings" className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {selectedIndex > 0 ? <Link className="cc-btn min-h-11 bg-white" href={sheetEditorUrl(page.slug, sheets[selectedIndex - 1].id)}>← Previous</Link> : <span />}
          <p className="text-sm font-bold text-violet-950">Drawing {selectedIndex + 1} of {sheets.length}</p>
          {selectedIndex < sheets.length - 1 ? <Link className="cc-btn min-h-11 bg-white" href={sheetEditorUrl(page.slug, sheets[selectedIndex + 1].id)}>Next →</Link> : <span />}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">{sheets.map((sheet, index) => <Link key={sheet.id} aria-current={index === selectedIndex ? "page" : undefined} title={sheet.title} href={sheetEditorUrl(page.slug!, sheet.id)} className={`flex h-11 min-w-11 items-center justify-center rounded-xl border font-bold ${index === selectedIndex ? "bg-violet-700 text-white" : "bg-white text-violet-900"}`}>{index + 1}</Link>)}</div>
        <p className="mt-3 text-xs text-violet-900">Your colors are saved on this device when browser storage is available.</p>
      </nav>}
      {svgContent || selected.imageUrl ? (
        <ColoringEditor
          key={selected.id}
          slug={selected.id === "cover" ? page.slug : `${page.slug}-${selected.id}`}
          title={selected.title}
          imageUrl={selected.imageUrl}
          svgContent={svgContent}
        />
      ) : (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
          <h2 className="text-xl font-extrabold text-amber-950">Online coloring is not available for this design yet</h2>
          <p className="mt-2 text-sm text-amber-900">This artwork could not be opened. You can still view the printable page.</p>
          <Link className="cc-btn cc-btn-dark mt-5" href={`/coloring-pages/${page.categorySlug}/${page.slug}/`}>
            View printable artwork
          </Link>
        </div>
      )}

      <RelatedColoringPages
        pages={relatedPages}
        title="Color More Pages Online"
      />
    </div>
  );
}
