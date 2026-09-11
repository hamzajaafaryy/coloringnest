import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ColoringEditor from "@/components/ColoringEditor";
import RelatedColoringPages from "@/components/RelatedColoringPages";
import { getPageBySlug, getRelatedPages, COLORING_PAGES } from "@/lib/data/coloringPages";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

interface ColorOnlinePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COLORING_PAGES.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ColorOnlinePageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return constructMetadata({ title: "Color Online Not Found", noindex: true });
  }

  return constructMetadata({
    title: `Color Online: ${page.title}`,
    description: `Color ${page.title} online for free directly in your browser. Touch and click-to-fill tools, color palette, brush, undo, and instant PNG download.`,
    path: `/color-online/${slug}/`,
  });
}

export default async function ColorOnlinePage({ params }: ColorOnlinePageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const relatedPages = getRelatedPages(page, 6);

  const breadcrumbItems = [
    { label: "Coloring Pages", href: "/coloring-pages/" },
    { label: page.categorySlug, href: `/coloring-pages/${page.categorySlug}/` },
    { label: page.title, href: `/coloring-pages/${page.categorySlug}/${page.slug}/` },
    { label: "Color Online", href: `/color-online/${slug}/` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      {/* Editor Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Browser Interactive Editor
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Color Online: {page.title}
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

      {/* Interactive Editor Component */}
      <ColoringEditor slug={page.slug} title={page.title} svgContent={page.svgContent} />

      {/* Related Pages */}
      <RelatedColoringPages pages={relatedPages} title="Color More Pages Online" />
    </div>
  );
}
