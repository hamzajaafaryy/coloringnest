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
import {
  getAllPublishedCategories,
  getAllPublishedColoringPagesWithCategory,
} from "@/db/queries";
import { constructMetadata, generateFAQSchema } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Free Coloring Pages for Kids - Print & Color Online",
  description:
    "Find free coloring pages for kids to print or color online. Explore unicorns, dinosaurs, animals, holidays and more with easy tools for phones, tablets and computers.",
  path: "/",
});

const HOMEPAGE_FAQS = [
  {
    question: "Are CraftColoring coloring pages free?",
    answer:
      "Yes. You can browse free coloring pages, use the online coloring tools, and print available designs for personal, classroom, or educational use.",
  },
  {
    question: "Can kids color these pages online on a phone or tablet?",
    answer:
      "Yes. The online coloring studio is designed for touch screens as well as desktop computers, so kids can tap, fill, brush, undo, and zoom in the browser.",
  },
  {
    question: "How do I print a coloring page?",
    answer:
      "Open a coloring page, choose the print option, and use your browser's print dialog. Printable pages are designed for common home and classroom paper sizes.",
  },
  {
    question: "What ages are these coloring pages for?",
    answer:
      "The collection includes simple pages for preschoolers, playful designs for school-age kids, and more detailed coloring pages for older children and adults.",
  },
];

const QUICK_THEMES = [
  { emoji: "🦄", label: "Unicorns", href: "/coloring-pages/unicorn/" },
  { emoji: "🦖", label: "Dinosaurs", href: "/coloring-pages/dinosaurs/" },
  { emoji: "🐶", label: "Animals", href: "/coloring-pages/animals/" },
  { emoji: "👑", label: "Princesses", href: "/coloring-pages/princesses/" },
  { emoji: "🎄", label: "Christmas", href: "/coloring-pages/christmas/" },
  { emoji: "🎃", label: "Halloween", href: "/coloring-pages/halloween/" },
];

export default async function HomePage() {
  const [allPages, allCategories] = await Promise.all([
    getAllPublishedColoringPagesWithCategory(),
    getAllPublishedCategories(),
  ]);

  const popular = allPages.filter((page) => page.popular);
  const popularPages = (popular.length ? popular : allPages).slice(0, 8);

  const preferredCategories = allCategories.filter(
    (category) => category.featured || category.popular
  );
  const featuredCategories = (
    preferredCategories.length ? preferredCategories : allCategories
  ).slice(0, 8);

  const newPages = [...allPages]
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime()
    )
    .slice(0, 4);

  const pageCountLabel =
    allPages.length > 0 ? `${allPages.length}+ pages to explore` : "New pages added often";

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(HOMEPAGE_FAQS)),
        }}
      />

      <section className="relative overflow-hidden bg-[#fffaf3]">
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-fuchsia-200/45 blur-3xl cc-float" />
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-sky-200/55 blur-3xl cc-float-reverse" />
        <div className="pointer-events-none absolute left-[16%] top-24 h-5 w-5 rotate-12 rounded-lg bg-yellow-300 cc-bounce-soft" />
        <div className="pointer-events-none absolute right-[12%] top-32 h-4 w-4 rounded-full bg-pink-400 cc-float" />

        <div className="relative mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,.94fr)] lg:px-8 lg:py-20">
          <div className="min-w-0 max-w-2xl">
            <div className="inline-flex max-w-full items-center gap-2 rounded-2xl border border-violet-200 bg-white px-3.5 py-2 text-xs font-black text-violet-700 shadow-sm sm:px-4">
              <Sparkles className="h-4 w-4 shrink-0 text-fuchsia-500" />
              <span>Free creative fun for kids, families & classrooms</span>
            </div>

            <h1 className="cc-safe-wrap mt-5 text-[clamp(2rem,8vw,2.55rem)] font-black leading-[1.03] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-[4.45rem]">
              Free coloring pages
              <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent cc-gradient-flow">
                for kids to print or color online
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
              Pick a fun design, color it right in your browser, or print a clean
              page for crayons and markers. No app and no sign-up needed.
            </p>

            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/color-online/"
                className="cc-btn cc-btn-primary w-full px-6 sm:w-auto"
              >
                <Wand2 className="h-5 w-5" />
                Start coloring
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/printable-coloring-pages/"
                className="cc-btn cc-btn-outline w-full px-6 sm:w-auto"
              >
                <Printer className="h-5 w-5 text-orange-500" />
                Print coloring pages
              </Link>
            </div>

            <div className="mt-6 max-w-xl">
              <SearchBar
                placeholder="Search unicorns, dinosaurs, cats..."
                size="lg"
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
              {QUICK_THEMES.map((theme) => (
                <Link
                  key={theme.label}
                  href={theme.href}
                  className="flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-2 text-center text-xs font-black text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 sm:px-3"
                >
                  <span aria-hidden="true">{theme.emoji}</span>
                  <span>{theme.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-black text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Free to use
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-yellow-500" />
                Works on mobile
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-pink-500" />
                {pageCountLabel}
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-xl">
            <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-violet-200/60 via-pink-100/70 to-sky-200/70 blur-2xl" />
            <div className="relative rounded-[2.35rem] border border-white bg-white/90 p-3 shadow-2xl backdrop-blur sm:p-5">
              <div className="rounded-[1.9rem] bg-gradient-to-br from-violet-100 via-pink-50 to-sky-100 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-violet-600 shadow-sm">
                    My coloring studio
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                    Ready!
                  </span>
                </div>

                <div className="mt-4 flex aspect-[4/3] items-center justify-center rounded-[1.6rem] bg-white shadow-lg ring-1 ring-violet-100">
                  <div className="relative h-44 w-44 sm:h-60 sm:w-60 cc-bounce-soft">
                    <div className="absolute left-8 top-8 h-28 w-28 rounded-[45%_55%_45%_55%] border-[5px] border-slate-800 bg-yellow-200 sm:h-36 sm:w-36" />
                    <div className="absolute left-20 top-2 h-10 w-10 -rotate-12 rounded-full border-4 border-slate-800 bg-pink-300" />
                    <div className="absolute left-4 top-20 h-10 w-10 rotate-12 rounded-full border-4 border-slate-800 bg-sky-300" />
                    <div className="absolute left-[52%] top-[42%] h-3 w-3 rounded-full bg-slate-800" />
                    <div className="absolute left-[68%] top-[42%] h-3 w-3 rounded-full bg-slate-800" />
                    <div className="absolute left-[55%] top-[58%] h-5 w-10 rounded-b-full border-b-4 border-slate-800" />
                    <Sparkles className="absolute right-1 top-6 h-8 w-8 text-fuchsia-400" />
                    <Star className="absolute bottom-5 left-0 h-7 w-7 fill-yellow-200 text-orange-400" />
                  </div>
                </div>

                <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="grid min-w-0 grid-cols-6 place-items-center gap-1 rounded-2xl bg-white px-2 py-3 shadow-sm">
                    {[
                      "bg-pink-400",
                      "bg-orange-300",
                      "bg-yellow-300",
                      "bg-emerald-300",
                      "bg-sky-400",
                      "bg-violet-400",
                    ].map((color) => (
                      <span
                        key={color}
                        className={`h-7 w-7 rounded-full ${color} ring-2 ring-white shadow-sm sm:h-8 sm:w-8`}
                      />
                    ))}
                  </div>
                  <div className="flex min-h-12 items-center justify-center rounded-2xl bg-violet-600 px-3 text-xs font-black text-white">
                    COLOR
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdPlaceholder slotName="Homepage Top Banner" format="banner" />

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:space-y-20">
        <section className="grid min-w-0 grid-cols-1 items-center gap-5 rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto]" aria-labelledby="colorquest-heading">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-violet-600">New · A story made by you</span>
            <h2 id="colorquest-heading" className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">Color a dragon. Create a storybook.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Meet a little dragon, choose a friend, and color your way through four magical chapters. Keep your very own book to download or print.</p>
          </div>
          <Link href="/colorquest/" className="cc-btn cc-btn-primary w-full lg:w-auto"><Sparkles className="h-5 w-5" />Play ColorQuest<ArrowRight className="h-4 w-4" /></Link>
        </section>

        <section aria-labelledby="popular-heading">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-500">
                Kids love these
              </span>
              <h2 id="popular-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Popular coloring pages
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
                Tap a picture to open it, then color online or print it.
              </p>
            </div>
            <Link
              href="/coloring-pages/"
              className="hidden min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-black text-violet-600 hover:bg-violet-50 sm:inline-flex"
            >
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-violet-50 via-white to-pink-50 p-2.5 sm:p-5">
            <ColoringGrid pages={popularPages} />
          </div>

          <Link
            href="/coloring-pages/"
            className="cc-btn cc-btn-soft mt-4 w-full sm:hidden"
          >
            See all coloring pages
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section aria-labelledby="categories-heading">
          <div className="mb-7 text-center">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-sky-500">
              Find a favorite
            </span>
            <h2 id="categories-heading" className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Browse coloring pages by theme
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
              Animals, fantasy, holidays, learning themes and more — easy to browse on phones and tablets.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-400 p-5 text-white shadow-2xl shadow-violet-200 sm:p-9">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-black uppercase tracking-wider ring-1 ring-white/20">
                <Palette className="h-4 w-4" />
                Easy for little hands
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Pick. Color. Save. Smile.
              </h2>
              <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-white/85 sm:text-base">
                The browser coloring studio has big touch-friendly controls, simple colors, undo and zoom so kids can focus on creating.
              </p>
              <Link
                href="/color-online/"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-violet-700 shadow-lg transition hover:-translate-y-0.5 sm:w-auto"
              >
                Try color online
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 min-[420px]:grid-cols-3">
              {[
                ["1", "Choose a page", "Pick a theme that looks fun.", "🖼️"],
                ["2", "Add colors", "Tap, fill or use the brush.", "🖍️"],
                ["3", "Keep it", "Save it or print another page.", "🌟"],
              ].map(([step, title, text, emoji]) => (
                <div key={step} className="rounded-3xl bg-white/15 p-4 ring-1 ring-white/20 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-violet-700">
                      {step}
                    </span>
                    <span className="text-2xl" aria-hidden="true">{emoji}</span>
                  </div>
                  <h3 className="mt-4 font-black">{title}</h3>
                  <p className="mt-1.5 text-xs font-semibold leading-5 text-white/80">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-orange-100 bg-[#fff6e8] p-5 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black text-orange-600 shadow-sm">
                <Printer className="h-4 w-4" />
                For home & classroom
              </span>
              <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
                Want paper and crayons instead?
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
                Browse printable coloring pages for quiet time, classroom activities, rainy days and creative breaks.
              </p>
            </div>
            <Link
              href="/printable-coloring-pages/"
              className="cc-btn w-full shrink-0 bg-orange-500 px-6 text-white shadow-lg shadow-orange-200 hover:bg-orange-600 sm:w-auto"
            >
              Browse printables
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {newPages.length > 0 && (
          <section aria-labelledby="new-heading">
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-500">
                  Fresh from the studio
                </span>
                <h2 id="new-heading" className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
                  New coloring pages
                </h2>
              </div>
              <Link href="/coloring-pages/" className="text-sm font-black text-violet-600">
                See all →
              </Link>
            </div>
            <ColoringGrid pages={newPages} />
          </section>
        )}

        <FAQ items={HOMEPAGE_FAQS} title="Coloring Page Questions" />
        <Newsletter />
      </div>
    </div>
  );
}
