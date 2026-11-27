import Link from "next/link";
import { ArrowRight, Check, Heart, Printer, Sparkles } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import ColoringGrid from "@/components/ColoringGrid";
import {
  getAllPublishedCategories,
} from "@/db/queries";
import { constructMetadata, buildPaginatedCanonicalUrl } from "@/lib/seo";
import { getPublishedCardPage } from "@/db/page-cards";
import { parsePage } from "@/lib/paging";
import PaginationLinks from "@/components/PaginationLinks";

export const dynamic = "force-dynamic";
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = parsePage((await searchParams).page);
  const listing = await getPublishedCardPage({ page });
  const metadata = constructMetadata({
    title: "Free Printable Coloring Pages for Kids",
    description:
      "Choose a free printable coloring page for kids. Browse our easy-to-print pictures for home, school, and fun afternoons with crayons.",
    path: "/printable-coloring-pages/",
  });
  return { ...metadata, alternates: { canonical: buildPaginatedCanonicalUrl("/printable-coloring-pages", listing.page) } };
}

export default async function PrintableDirectory({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const [allCategories, listing] = await Promise.all([
    getAllPublishedCategories(),
    getPublishedCardPage({ page: parsePage((await searchParams).page) }),
  ]);
  const allPages = listing.pages;
  const categories = allCategories.filter((cat) => Boolean(cat.slug && cat.pageCount > 0))
    .sort((a, b) => Number(b.pageCount > 0) - Number(a.pageCount > 0) || Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name));
  const pages = allPages.filter((page) => Boolean(page.slug && page.categorySlug));

  return (
    <main className="min-w-0 overflow-hidden bg-[#fffaf0]">
      <section className="relative overflow-hidden border-b-2 border-[#2b2140] bg-[#fff3d6]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-24 h-96 w-96 rounded-full border-[65px] border-white/50" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#2b2140] bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-[#2b2140] shadow-[3px_3px_0_#2b2140]">
              <Printer className="h-4 w-4" /> Print a little happiness
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#2b2140] sm:text-6xl">
              Printable coloring pages for little hands.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#514461] sm:text-lg">
              All you need is paper and a few crayons. Choose a free coloring page, print it at home or school, and let the colors flow.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link href="#printable-pages" className="cc-sticker cc-sticker-red">
                Find your next page <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/coloring-pages/" className="cc-sticker cc-sticker-white">
                Browse by theme
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[#514461]">
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#167347]" /> Free to use</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-[#167347]" /> No sign-up needed</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-xs rounded-[2.4rem] border-[6px] border-[#2b2140] bg-white p-8 text-center shadow-[7px_7px_0_#2b2140] lg:rotate-[3deg]">
            <Printer className="mx-auto h-20 w-20 text-[#2b2140]" strokeWidth={1.35} />
            <div className="mx-auto mt-5 h-2 w-28 rounded-full bg-[#ffd23f]" />
            <div className="mx-auto mt-3 h-2 w-36 rounded-full bg-[#e8f4ff]" />
            <Heart className="mx-auto mt-5 h-12 w-12 fill-[#ff7ab8] text-[#2b2140]" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-black text-[#2b2140]">Made for art time!</p>
          </div>
        </div>
      </section>

      <section id="printable-pages" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16">
        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#bf7856]"><Sparkles className="h-4 w-4" /> Pick a printable</span>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="mt-3 text-3xl font-black text-[#362b4a] sm:text-4xl">Pictures ready for your crayons</h2>
            <p className="mt-2 text-sm leading-7 text-[#756a7f]">Open a picture and use the Print option to get started.</p>
          </div>
        </div>
        {pages.length ? <><ColoringGrid pages={pages} variant="printable" /><PaginationLinks path="/printable-coloring-pages" page={listing.page} pageCount={listing.pageCount} /></> : (
          <div className="rounded-3xl border-2 border-dashed border-[#f0dfd6] bg-[#fffaf4] px-6 py-12 text-center text-[#866c76]">
            Printable pictures will appear here as soon as they are published.
          </div>
        )}
      </section>

      {categories.some((category) => category.pageCount > 0) && (
        <section className="border-y-2 border-dashed border-[#3ecf8e] bg-[#c9f2dc] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-3xl font-black text-[#362b4a] sm:text-4xl">Find a printable by theme</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#756a7f]">From animals to magical worlds, there is a theme for every mood.</p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {categories.filter((category) => category.pageCount > 0).slice(0, 8).map((category) => <CategoryCard key={category.id} category={category} variant="printable" />)}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="rounded-[2rem] bg-[#e6f3e7] px-7 py-9 sm:px-12 sm:py-12">
          <h2 className="text-2xl font-black text-[#2d5940] sm:text-3xl">How to print your coloring page</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#54715f]">Pick a picture, open its page, and choose Print. Your browser will let you select your printer and paper settings. Then find a comfy spot and enjoy coloring.</p>
          <Link href="/coloring-pages/" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#2b6b43] underline">See all coloring pages <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}
