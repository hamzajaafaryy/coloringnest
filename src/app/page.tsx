import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Palette,
  Printer,
  Sparkles,
  Star,
  Wand2,
  Zap,
} from "lucide-react";

import SearchBar from "@/components/SearchBar";
import ColoringGrid from "@/components/ColoringGrid";
import CategoryCard from "@/components/CategoryCard";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import AdPlaceholder from "@/components/AdPlaceholder";
import { getAllPublishedCategories, getAllPublishedColoringPagesWithCategory } from "@/db/queries";
import { constructMetadata, generateFAQSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Free Online Coloring Pages for Kids & Adults",
  description:
    "Explore free online coloring pages for kids and adults. Color directly in your browser with interactive tools, themed collections, and creative activities.",
  path: "/",
});

const HOMEPAGE_FAQS = [
  { question: "Are all coloring pages on CraftColoring free?", answer: "Yes! CraftColoring offers free coloring experiences you can explore online without an account." },
  { question: "Can I color pages online without downloading an app?", answer: "Yes! The interactive coloring tool works in your browser on phones, tablets and desktop computers." },
  { question: "How do I print a coloring page at home?", answer: "Open a coloring page and use the print option to create a clean outline for home or classroom use." },
  { question: "What age groups are these coloring pages for?", answer: "CraftColoring includes simple designs for young children, creative activities for school-age kids and detailed artwork for adults." },
];

export default async function HomePage() {
  const [allPages, allCategories] = await Promise.all([
    getAllPublishedColoringPagesWithCategory(),
    getAllPublishedCategories(),
  ]);

  const popularPages = allPages.filter((page) => page.popular).slice(0, 8);
  const featuredCategories = allCategories.slice(0, 8);
  const newPages = [...allPages]
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())
    .slice(0, 4);

  const exampleSearches = [
    ["Unicorn", "/coloring-pages/unicorn/"],
    ["Dinosaurs", "/coloring-pages/dinosaurs/"],
    ["Princesses", "/coloring-pages/princesses/"],
    ["Animals", "/coloring-pages/animals/"],
    ["Christmas", "/coloring-pages/christmas/"],
    ["Halloween", "/coloring-pages/halloween/"],
  ];

  return (
    <div className="overflow-hidden">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(HOMEPAGE_FAQS)) }} />

      <section className="relative overflow-hidden bg-[#fff9f2]">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-fuchsia-200/50 blur-3xl cc-float" />
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl cc-float-reverse" />
        <div className="absolute left-[18%] top-24 h-5 w-5 rotate-12 rounded-lg bg-yellow-300 cc-bounce-soft" />
        <div className="absolute right-[18%] top-36 h-4 w-4 rounded-full bg-pink-400 cc-float" />
        <div className="absolute bottom-12 left-[9%] h-6 w-6 rotate-45 rounded-md bg-violet-300 cc-float-reverse" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-extrabold text-violet-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-fuchsia-500" />
              A happy place to create & color
            </div>

            <h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-[-0.045em] text-slate-900 sm:text-6xl lg:text-7xl">
              Big imagination.
              <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent cc-gradient-flow">
                Bright colors.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-slate-600 sm:text-lg">
              Discover playful coloring pages for kids, families, teachers and creative adults — then color them right in your browser.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/color-online/unicorn-rainbow-coloring-page/" className="cc-btn cc-btn-primary w-full px-5 py-3.5 sm:w-auto sm:px-6 sm:py-4">
                <Wand2 className="h-5 w-5 transition group-hover:rotate-12" />
                Start Coloring Online
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link href="/coloring-pages/" className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:text-violet-700">
                <Palette className="h-5 w-5 text-violet-500" />
                Explore Pages
              </Link>
            </div>

            <div className="mt-7 max-w-xl">
              <SearchBar placeholder="What do you want to color today? ✨" size="lg" />
              <div className="mt-3 flex flex-wrap gap-2">
                {exampleSearches.map(([label, href]) => (
                  <Link key={label} href={href} className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700 hover:ring-violet-200">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate-500">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Free to explore</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-yellow-500" /> Instant browser coloring</span>
              <span className="inline-flex items-center gap-1.5"><Heart className="h-4 w-4 text-pink-500" /> Made for creativity</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:pl-8">
            <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-violet-200/60 via-pink-100/70 to-sky-200/70 blur-2xl" />
            <div className="relative rotate-1 rounded-[2.5rem] border border-white bg-white/80 p-4 shadow-2xl backdrop-blur sm:p-5">
              <div className="rounded-[2rem] bg-gradient-to-br from-violet-100 via-pink-50 to-sky-100 p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-violet-600 shadow-sm">Color studio</span>
                  <span className="flex gap-1">
                    <i className="h-3 w-3 rounded-full bg-pink-400" />
                    <i className="h-3 w-3 rounded-full bg-yellow-300" />
                    <i className="h-3 w-3 rounded-full bg-sky-400" />
                  </span>
                </div>
                <div className="mt-5 flex aspect-[4/3] items-center justify-center rounded-[1.7rem] bg-white shadow-lg">
                  <div className="relative h-48 w-48 sm:h-60 sm:w-60 cc-bounce-soft">
                    <div className="absolute left-8 top-8 h-32 w-32 rounded-[45%_55%_45%_55%] border-[5px] border-slate-800 bg-yellow-200" />
                    <div className="absolute left-20 top-2 h-10 w-10 -rotate-12 rounded-full border-4 border-slate-800 bg-pink-300" />
                    <div className="absolute left-4 top-20 h-10 w-10 rotate-12 rounded-full border-4 border-slate-800 bg-sky-300" />
                    <div className="absolute left-[52%] top-[42%] h-3 w-3 rounded-full bg-slate-800" />
                    <div className="absolute left-[68%] top-[42%] h-3 w-3 rounded-full bg-slate-800" />
                    <div className="absolute left-[55%] top-[58%] h-5 w-10 rounded-b-full border-b-4 border-slate-800" />
                    <Sparkles className="absolute right-1 top-6 h-8 w-8 text-fuchsia-400" />
                    <Star className="absolute bottom-5 left-0 h-7 w-7 text-orange-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
                  {["bg-pink-400", "bg-orange-300", "bg-yellow-300", "bg-emerald-300", "bg-sky-400", "bg-violet-400"].map((color) => (
                    <span key={color} className={`h-8 w-8 rounded-full ${color} ring-2 ring-white shadow-sm`} />
                  ))}
                  <span className="ml-auto rounded-xl bg-violet-600 px-3 py-2 text-[10px] font-black text-white">COLOR!</span>
                </div>
              </div>
            </div>
            <div className="absolute -left-4 bottom-8 hidden rounded-2xl bg-white px-4 py-3 shadow-xl sm:block cc-float">
              <p className="text-[10px] font-black uppercase tracking-wider text-violet-500">Creative time</p>
              <p className="mt-1 text-sm font-black text-slate-800">Make something colorful ✨</p>
            </div>
            <div className="absolute -right-3 top-8 hidden rounded-2xl bg-yellow-300 px-4 py-3 shadow-lg sm:block cc-float-reverse">
              <p className="text-xs font-black text-slate-900">100% fun</p>
            </div>
          </div>
        </div>
      </section>

      <AdPlaceholder slotName="Homepage Top Banner" format="banner" />

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-500">Pick a favorite</span>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Popular right now</h2>
              <p className="mt-2 text-sm text-slate-500">Fun designs ready for your next colorful adventure.</p>
            </div>
            <Link href="/coloring-pages/" className="inline-flex items-center gap-1.5 text-sm font-black text-violet-600 hover:text-fuchsia-600">See all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-violet-50 via-white to-pink-50 p-3 sm:p-5">
            <ColoringGrid pages={popularPages} />
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 p-6 text-white shadow-2xl shadow-violet-200 sm:p-10">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-yellow-200/15 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/80"><Wand2 className="h-4 w-4" /> Explore by mood</div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                ["🌈", "Cute & Magical", "Unicorns, princesses, rainbows and dreamy friends.", "/coloring-pages/unicorn/"],
                ["🦖", "Wild & Adventurous", "Dinosaurs, animals, jungle and big adventures.", "/coloring-pages/dinosaurs/"],
                ["🌸", "Calm & Creative", "Flowers, mandalas and relaxing designs for everyone.", "/coloring-pages/adults/"],
              ].map(([emoji, title, text, href]) => (
                <Link key={title} href={href} className="group rounded-3xl bg-white/15 p-5 ring-1 ring-white/20 backdrop-blur transition hover:-translate-y-1 hover:bg-white/20">
                  <span className="text-3xl">{emoji}</span>
                  <h3 className="mt-4 font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/80">{text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-black">Explore <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-8 text-center">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-500">Find your theme</span>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Color by category</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">From cute animals to space adventures, there is always something new to color.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((cat, index) => (
              <div key={cat.id} className="">
                <CategoryCard category={cat} />
              </div>
            ))}
          </div>
        </section>

        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-black text-violet-700"><Palette className="h-3.5 w-3.5" /> Color online</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Turn a blank outline into your own masterpiece.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">Choose colors, tap closed shapes, experiment, undo and keep creating. No complicated setup — just open a page and start.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Tap-to-fill coloring", "Brush & custom colors", "Undo, redo & zoom", "Works on mobile & desktop"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-100"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}</div>
              ))}
            </div>
            <Link href="/color-online/unicorn-rainbow-coloring-page/" className="cc-btn cc-btn-dark mt-7 w-full px-5 py-3.5 sm:w-auto sm:px-6">Try the coloring studio <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-yellow-100 via-pink-100 to-violet-200 p-7">
            <div className="absolute right-5 top-5 cc-float"><Star className="h-8 w-8 fill-yellow-300 text-yellow-500" /></div>
            <div className="absolute bottom-5 left-5 cc-float-reverse"><Heart className="h-7 w-7 fill-pink-400 text-pink-500" /></div>
            <div className="rounded-[2rem] bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-slate-500">MY COLORING</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-700">READY</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-pink-100 to-orange-100 p-4"><div className="h-full rounded-xl border-4 border-dashed border-pink-300" /></div>
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 p-4"><div className="h-full rounded-xl border-4 border-dashed border-violet-300" /></div>
              </div>
              <div className="mt-4 flex justify-center gap-2">{["bg-pink-400","bg-orange-400","bg-yellow-300","bg-emerald-400","bg-sky-400","bg-violet-500"].map(c => <span key={c} className={`h-7 w-7 rounded-full ${c}`} />)}</div>
            </div>
          </div>
        </section>

        <section className="rounded-[2.5rem] bg-[#fff5df] p-7 sm:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black text-orange-600 shadow-sm"><Printer className="h-3.5 w-3.5" /> Print when you want</span>
              <h2 className="mt-4 text-3xl font-black text-slate-900">Prefer crayons on paper?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Explore printable-friendly outlines for home, classrooms and creative afternoons.</p>
            </div>
            <Link href="/printable-coloring-pages/" className="cc-btn w-full shrink-0 bg-orange-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-200 hover:bg-orange-600 sm:w-auto sm:px-6">Browse printables <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section>
          <div className="mb-7 flex items-end justify-between">
            <div><span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Fresh from the studio</span><h2 className="mt-1 text-3xl font-black text-slate-900">New coloring pages</h2></div>
            <Link href="/coloring-pages/" className="text-sm font-black text-violet-600">See all →</Link>
          </div>
          <ColoringGrid pages={newPages} />
        </section>

        <section>
          <div className="mb-7 text-center">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Made for every age</span>
            <h2 className="mt-1 text-3xl font-black text-slate-900">Pick your kind of fun</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["🧸", "Little Artists", "Simple shapes, friendly animals and early-learning themes.", "/coloring-pages/preschool/", "bg-pink-50 border-pink-200"],
              ["🚀", "Big Kids", "Dinosaurs, space, fantasy and exciting creative adventures.", "/coloring-pages/kindergarten/", "bg-sky-50 border-sky-200"],
              ["🌿", "Creative Adults", "Botanical, floral and detailed designs for relaxing color time.", "/coloring-pages/adults/", "bg-violet-50 border-violet-200"],
            ].map(([emoji, title, text, href, cls]) => (
              <Link key={title} href={href} className={`group rounded-[2rem] border p-6 transition hover:-translate-y-1 hover:shadow-xl ${cls}`}>
                <span className="text-4xl">{emoji}</span>
                <h3 className="mt-5 text-xl font-black text-slate-900 group-hover:text-violet-700">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-black text-violet-600">Explore <ArrowRight className="h-3 w-3" /></span>
              </Link>
            ))}
          </div>
        </section>

        <FAQ items={HOMEPAGE_FAQS} />
        <Newsletter />
      </div>
    </div>
  );
}
