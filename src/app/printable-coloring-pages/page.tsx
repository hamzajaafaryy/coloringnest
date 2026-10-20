import Link from "next/link";
import { ArrowRight, Check, Heart, Printer, Sparkles } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import ColoringGrid from "@/components/ColoringGrid";
import {
  getAllPublishedCategories,
  getAllPublishedColoringPagesWithCategory,
} from "@/db/queries";
import { constructMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = constructMetadata({
  title: "Free Printable Coloring Pages for Kids",
  description:
    "Choose a free printable coloring page for kids. Browse our easy-to-print pictures for home, school, and fun afternoons with crayons.",
  path: "/printable-coloring-pages/",
});

export default async function PrintableDirectory() {
  const [allCategories, allPages] = await Promise.all([
    getAllPublishedCategories(),
    getAllPublishedColoringPagesWithCategory(),
  ]);
  const categories = allCategories.filter((cat) => Boolean(cat.slug))
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name));
  const pages = allPages.filter((page) => Boolean(page.slug && page.categorySlug));

  return (
    <main className="min-w-0 overflow-hidden bg-[#fffdfa]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff0d8] via-[#fff9f4] to-[#ffe5ec]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-24 h-96 w-96 rounded-full border-[65px] border-white/50" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f5d5a4] bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#ab651e]">
              <Printer className="h-4 w-4" /> Print a little happiness
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#40304e] sm:text-6xl">
              Printable coloring pages for little hands.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#705c70] sm:text-lg">
              All you need is paper and a few crayons. Choose a free coloring page, print it at home or school, and let the colors flow.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link href="#printable-pages" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#b96b4a] px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#9f4e38]">
                Find your next page <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/coloring-pages/" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#e6c6ba] bg-white px-6 py-3 text-sm font-bold text-[#8c523f] transition hover:bg-[#fff6ed]">
                Browse by theme
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[#84687b]">
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> Free to use</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> No sign-up needed</span>
            </div>
          </div>
          <div className="mx-auto w-full max-w-xs rounded-[2.4rem] border-[12px] border-white bg-[#fffaf0] p-8 text-center shadow-[0_28px_65px_rgba(149,90,66,0.16)] lg:rotate-[5deg]">
            <Printer className="mx-auto h-20 w-20 text-[#b96b4a]" strokeWidth={1.35} />
            <div className="mx-auto mt-5 h-2 w-28 rounded-full bg-[#ffd59c]" />
            <div className="mx-auto mt-3 h-2 w-36 rounded-full bg-[#f5e3cb]" />
            <Heart className="mx-auto mt-5 h-12 w-12 fill-[#f8b5bf] text-[#ee8d9d]" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-black text-[#7b4f63]">Made for art time!</p>
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
        {pages.length ? <ColoringGrid pages={pages} variant="printable" /> : (
          <div className="rounded-3xl border-2 border-dashed border-[#f0dfd6] bg-[#fffaf4] px-6 py-12 text-center text-[#866c76]">
            Printable pictures will appear here as soon as they are published.
          </div>
        )}
      </section>

      {categories.length > 0 && (
        <section className="bg-[#f8f6ff] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-3xl font-black text-[#362b4a] sm:text-4xl">Find a printable by theme</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#756a7f]">From animals to magical worlds, there is a theme for every mood.</p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {categories.slice(0, 8).map((category) => <CategoryCard key={category.id} category={category} variant="printable" />)}
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
