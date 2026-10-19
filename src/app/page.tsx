import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Palette,
  Printer,
  Shuffle,
  Sparkles,
  Gamepad2,
  Rocket,
  Star,
  Wand2,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

import SearchBar from "@/components/SearchBar";
import AdsterraNativeBanner from "@/components/ads/AdsterraNativeBanner";
import HeroArtwork from "@/components/home/HeroArtwork";
import HomePlayGames from "@/components/home/HomePlayGames";
import { curatedColoringCards } from "@/lib/data/curatedColoring";
import ColoringGrid from "@/components/ColoringGrid";
import CategoryCard from "@/components/CategoryCard";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";

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

  const popularPages = [...allPages]
    .sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular)) || Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 8);
  const featuredCategories = [...allCategories]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Number(Boolean(b.popular)) - Number(Boolean(a.popular)))
    .slice(0, 8);
  const newPages = [...allPages]
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())
    .slice(0, 4);

  const exampleSearches = featuredCategories
    .filter(category => Boolean(category.slug))
    .slice(0, 4)
    .map(category => [category.name, `/coloring-pages/${category.slug}/`] as const);
  const themeHref = (pattern: RegExp) => {
    const found = allCategories.find(category => category.slug && pattern.test(category.slug));
    return found?.slug ? `/coloring-pages/${found.slug}/` : "/coloring-pages/";
  };
  const magicHref = themeHref(/unicorn|fantasy|princess|fairy/i);
  const adventureHref = themeHref(/dino|animal|ocean|vehicle/i);
  const calmHref = themeHref(/flower|garden|mandala|adult|nature/i);

  return (
    <div className="overflow-hidden">
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(HOMEPAGE_FAQS)) }} />

      <section className="relative isolate overflow-hidden border-b border-amber-100 bg-[#fffaf2]">
        <div className="pointer-events-none absolute -left-28 top-10 h-80 w-80 rounded-full bg-pink-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-96 w-96 rounded-full bg-sky-200/70 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-[40%] h-48 w-80 rounded-full bg-yellow-200/50 blur-3xl" />
        <div className="absolute left-5 top-24 hidden text-3xl text-violet-400 cc-float sm:block" aria-hidden="true">✦</div>
        <div className="absolute right-[8%] top-12 text-4xl cc-float-reverse" aria-hidden="true">🌟</div>
        <div className="relative mx-auto grid min-w-0 max-w-7xl items-center gap-7 px-4 pb-12 pt-11 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.03fr_.97fr] lg:gap-6 lg:px-8 lg:py-20">
          <div className="relative z-10 min-w-0 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-200 bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-[.12em] text-amber-900 shadow-sm">
              <span aria-hidden="true">🌈</span> A whole world of creative fun!
            </div>

            <h1 className="mt-6 text-[clamp(2.9rem,5.4vw,5.4rem)] font-black leading-[1.02] tracking-[-.055em] text-[#231747]">
              Little hands.<br />
              <span className="bg-gradient-to-r from-[#ff5a87] via-[#a249d9] to-[#5b4ff6] bg-clip-text text-transparent">BIG magic.</span><span className="ml-2 inline-block rotate-12 text-[.64em]">✨</span>
            </h1>

            <p className="mt-5 max-w-lg text-base font-semibold leading-8 text-slate-600 sm:text-lg">
              A colorful playground where kids can <span className="font-black text-violet-700">color cartoon friends, draw, play games and earn stars</span> and bring their wildest ideas to life. Every adventure starts with a little imagination!
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/play/#cartoon" className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-[1.2rem] bg-[#7143e9] px-7 py-4 text-base font-black text-white shadow-[0_14px_32px_rgba(109,40,217,.28)] transition duration-200 hover:-translate-y-1 hover:bg-[#5726c7] hover:shadow-xl">
                <Gamepad2 className="h-5 w-5" /> Let&apos;s Play! <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <Link href="/color-online/" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[1.2rem] border-2 border-[#231747] bg-white px-6 py-4 text-base font-black text-[#231747] transition hover:-translate-y-1 hover:bg-yellow-100">
                <Palette className="h-5 w-5 text-pink-500" /> Color a Picture
              </Link>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-2 sm:gap-3">
              {[
                ["🎨", "Free art", "Create anything"],
                ["🧩", "Fun games", "Learn by playing"],
                ["⭐", "Earn stars", "Celebrate every win"],
              ].map(([emoji, title, subtitle]) => (
                <div key={title} className="rounded-2xl border border-white bg-white/80 px-3 py-3 shadow-sm backdrop-blur">
                  <span className="text-2xl" aria-hidden="true">{emoji}</span>
                  <p className="mt-1 text-xs font-black text-slate-900 sm:text-sm">{title}</p>
                  <p className="mt-0.5 text-[10px] font-semibold leading-4 text-slate-500 sm:text-xs">{subtitle}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 max-w-lg">
              <SearchBar placeholder="Find unicorns, cats, dinosaurs..." size="lg" />
              <div className="mt-3 flex flex-wrap gap-2">
                {exampleSearches.map(([label, href]) => (
                  <Link key={label} href={href} className="rounded-full border border-violet-100 bg-white px-3.5 py-1.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100">
                    {label}
                  </Link>
                ))}
                <Link href="/surprise-me/" className="rounded-full border border-amber-200 bg-amber-100 px-3.5 py-1.5 text-xs font-bold text-amber-900 transition hover:bg-amber-200">✨ Surprise me</Link>
              </div>
            </div>
          </div>
          <div className="relative min-w-0">
            <HeroArtwork />
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-[-1px] left-0 right-0 h-3 bg-gradient-to-r from-rose-300 via-yellow-300 via-green-300 to-violet-400" />
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8"><HomePlayGames /></div>
      <section aria-labelledby="open-clipart-home" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-black uppercase tracking-wide text-emerald-800">
              <ShieldCheck className="h-4 w-4" /> Public-domain artwork · CC0
            </span>
            <h2 id="open-clipart-home" className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Fresh printable line art from real artists
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">10 handpicked coloring pictures from Openclipart's public-domain collection. No watermark, no sign-up. Print the artwork or color it online.</p>
          </div>
          <Link href="/coloring-pages/#public-domain" className="cc-btn cc-btn-outline">View all 10 new pictures <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <ColoringGrid pages={curatedColoringCards().slice(0,4)} />
      </section>


      <AdsterraNativeBanner />

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
                ["🌈", "Cute & Magical", "Unicorns, princesses, rainbows and dreamy friends.", magicHref],
                ["🦖", "Wild & Adventurous", "Dinosaurs, animals, jungle and big adventures.", adventureHref],
                ["🌸", "Calm & Creative", "Flowers, mandalas and relaxing designs for everyone.", calmHref],
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
            <Link href="/color-online/" className="cc-btn cc-btn-dark mt-7 w-full px-5 py-3.5 sm:w-auto sm:px-6">Try the coloring studio <ArrowRight className="h-4 w-4" /></Link>
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
              ["🌿", "Creative Adults", "Botanical, floral and detailed designs for relaxing color time.", calmHref, "bg-violet-50 border-violet-200"],
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
