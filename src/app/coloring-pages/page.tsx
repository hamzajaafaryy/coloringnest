import Link from "next/link";
import { ArrowRight, Heart, Palette, Search, Sparkles } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import ColoringGrid from "@/components/ColoringGrid";
import SearchBar from "@/components/SearchBar";
import {
  getAllPublishedCategories,
  getAllPublishedColoringPagesWithCategory,
} from "@/db/queries";
import { constructMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = constructMetadata({
  title: "Free Coloring Pages for Kids",
  description:
    "Explore free coloring pages for kids by theme. Find animals, dinosaurs, unicorns, and more, then print a picture for a little creative time.",
  path: "/coloring-pages/",
});

export default async function ColoringPagesDirectory() {
  const [allCategories, allPages] = await Promise.all([
    getAllPublishedCategories(),
    getAllPublishedColoringPagesWithCategory(),
  ]);
  const categories = allCategories.filter((cat) => Boolean(cat.slug))
    .sort((a, b) => Number(b.pageCount > 0) - Number(a.pageCount > 0) || Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name));
  const pages = allPages.filter((page) => Boolean(page.slug && page.categorySlug));

  return (
    <main className="min-w-0 overflow-hidden bg-[#fffdfa]">
      <section className="relative overflow-hidden border-b border-[#eee4d8] bg-gradient-to-br from-[#f9ebff] via-[#fffbf3] to-[#e5f6ff]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[45px] border-white/60" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-[#8146b9] shadow-sm">
            <Sparkles className="h-4 w-4" /> Let&apos;s find something fun
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-[#302247] sm:text-6xl">
            So many pictures.<br />
            <span className="text-[#9253cc]">So many colors.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#6d607a] sm:text-lg">
            Browse free coloring pages for kids. Find a favorite animal, try a magical theme, or choose a picture just because it makes you smile.
          </p>
          <div className="mt-7 max-w-lg rounded-[1.4rem] bg-white p-2 shadow-[0_10px_28px_rgba(85,53,112,0.1)]">
            <SearchBar size="lg" placeholder="What would you like to color?" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#a45bc3]">Explore by theme</span>
            <h2 className="mt-2 text-3xl font-black text-[#302247] sm:text-4xl">Find your favorite kind of picture</h2>
            <p className="mt-2 text-sm leading-6 text-[#756b81]">Choose a theme to see its coloring pages.</p>
          </div>
        </div>
        {categories.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {categories.map((category) => <CategoryCard key={category.id} category={category} />)}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-[#e4d7ed] bg-white p-9 text-center text-[#71627e]">New themes are being added.</div>
        )}
      </section>

      <section className="border-t border-[#eeebf5] bg-[#f7f7ff] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#9253bb]"><Heart className="h-4 w-4" /> The coloring shelf</span>
              <h2 className="mt-3 text-3xl font-black text-[#302247] sm:text-4xl">All coloring pages</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#776d82]">Take a look around. New pages appear here whenever they are published.</p>
            </div>
            <Link href="/printable-coloring-pages/" className="inline-flex items-center gap-2 text-sm font-bold text-[#7840b6] hover:underline">Looking for printables? <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {pages.length ? <ColoringGrid pages={pages} /> : (
            <div className="rounded-3xl border border-[#e5dced] bg-white px-6 py-12 text-center">
              <Palette className="mx-auto h-10 w-10 text-[#9b66cf]" />
              <h3 className="mt-4 text-xl font-black text-[#49345e]">New pictures are on the way</h3>
              <p className="mt-2 text-sm leading-7 text-[#776d82]">Check back soon for our first coloring pages.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
