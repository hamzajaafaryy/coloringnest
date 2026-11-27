import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ColoringGrid from "@/components/ColoringGrid";
import { getPublishedCardPage } from "@/db/page-cards";
import { parsePage } from "@/lib/paging";
import PaginationLinks from "@/components/PaginationLinks";
import { constructMetadata, buildPaginatedCanonicalUrl, generateBreadcrumbSchema, serializeJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage((await searchParams).page);
  const listing = await getPublishedCardPage({ onlineOnly: true, page });
  const metadata = constructMetadata({
    title: "Coloring Pages Online",
    description:
      "Color free coloring pages online in your browser with CraftColoring's interactive tools. Choose a design and start coloring instantly.",
    path: "/color-online/",
  });
  return { ...metadata, alternates: { canonical: buildPaginatedCanonicalUrl("/color-online", listing.page) } };
}

export default async function ColorOnlineDirectoryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const listing = await getPublishedCardPage({ onlineOnly: true, page: parsePage((await searchParams).page) });
  const pages = listing.pages;

  const breadcrumbItems = [
    { label: "Color Online", href: "/color-online/" },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="max-w-3xl space-y-4">
        <span className="inline-flex min-h-10 items-center rounded-full border-2 border-[#2b2140] bg-[#c4a8f8] px-3 py-1 text-xs font-bold text-[#2b2140] shadow-[3px_3px_0_#2b2140]">
          Interactive Browser Coloring
        </span>
        <h1 className="text-3xl font-black tracking-tight text-[#2b2140] sm:text-5xl">
          Color Coloring Pages Online
        </h1>
        <p className="text-base leading-7 text-[#514461] sm:text-lg sm:leading-8">
          Choose an interactive picture to color on screen. Some pictures are only available to print, so those will appear in our printable collection instead.
        </p>
      </header>

      <section className="relative overflow-hidden rounded-[2rem] border-2 border-[#2b2140] bg-[#4c3176] p-6 text-white shadow-[7px_7px_0_#2b2140] sm:p-8">
        <div className="absolute -right-6 -top-6 text-8xl opacity-40" aria-hidden="true">🌈</div>
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#ffd23f]">Need a warm-up?</p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">Meet our five creative art adventures!</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-white">Paint original cartoon animals, explore color challenges, find matching friends and draw your own art.</p>
          </div>
          <Link href="/play/" className="cc-btn bg-yellow-300 text-violet-950 shadow-lg hover:bg-yellow-200">🎮 Play kids games →</Link>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Choose a Coloring Page
        </h2>
        <ColoringGrid
          pages={pages}
          emptyMessage="Online coloring pages are being added soon."
        />
        <PaginationLinks path="/color-online" page={listing.page} pageCount={listing.pageCount} />
      </section>

      <section className="cc-content-page max-w-3xl">
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
