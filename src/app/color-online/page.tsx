import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ColoringGrid from "@/components/ColoringGrid";
import { getAllPublishedColoringPagesWithCategory } from "@/db/queries";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Coloring Pages Online",
  description:
    "Color free coloring pages online in your browser with CraftColoring's interactive tools. Choose a design and start coloring instantly.",
  path: "/color-online/",
});

export default async function ColorOnlineDirectoryPage() {
  const pages = await getAllPublishedColoringPagesWithCategory();

  const breadcrumbItems = [
    { label: "Color Online", href: "/color-online/" },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="max-w-3xl space-y-4">
        <span className="inline-flex px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
          Interactive Browser Coloring
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Color Coloring Pages Online
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Pick a design and color it directly in your browser. Use the fill
          tool, brush, colors, undo, zoom, and reset controls without needing
          to install an app.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Choose a Coloring Page
        </h2>
        <ColoringGrid
          pages={pages}
          emptyMessage="Online coloring pages are being added soon."
        />
      </section>

      <section className="max-w-3xl prose prose-indigo text-slate-700">
        <h2>How online coloring works</h2>
        <p>
          Open any design, choose a color, and tap or click a closed area of
          the artwork. Your progress can be saved locally in your browser so
          you can continue coloring on the same device.
        </p>
        <p>
          CraftColoring is designed to work on desktop computers, phones, and
          tablets with touch-friendly controls.
        </p>
      </section>

      <div className="text-center">
        <Link
          href="/coloring-pages/"
          className="inline-flex items-center px-5 py-3 rounded-xl border border-slate-200 font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          Browse all coloring pages
        </Link>
      </div>
    </div>
  );
}
