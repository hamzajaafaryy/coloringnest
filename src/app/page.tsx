import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Heart,
  Palette,
  Paintbrush,
  Printer,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import ColoringGrid from "@/components/ColoringGrid";
import SearchBar from "@/components/SearchBar";
import HeroArtwork from "@/components/home/HeroArtwork";
import NameColoringTeaser from "@/components/name-coloring/NameColoringTeaser";
import { getAllPublishedCategories } from "@/db/queries";
import { constructMetadata } from "@/lib/seo";
import { getPublishedCardPage } from "@/db/page-cards";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Free Printable Coloring Pages for Kids | CraftColoring",
  description:
    "Explore free printable coloring pages for kids, including animals, dinosaurs, princesses and more. Print PDF pages or color online at CraftColoring.",
  path: "/",
});

const steps = [
  {
    number: "01",
    title: "Choose a page",
    body: "Find a favorite theme, from friendly animals to magical worlds.",
    icon: Search,
  },
  {
    number: "02",
    title: "Print or color online",
    body: "Open a page to print it at home or enjoy coloring on your screen.",
    icon: Printer,
  },
  {
    number: "03",
    title: "Add your colors",
    body: "Pick your crayons, pencils, or favorite colors and make it yours.",
    icon: Paintbrush,
  },
];

const questions = [
  {
    question: "Are CraftColoring pages free?",
    answer:
      "Yes. You can browse the available coloring pages for free and print pages without creating an account.",
  },
  {
    question: "Can I print coloring pages at home?",
    answer:
      "Yes. Open the coloring page you like and choose the Print option. Your browser will show the available printer and paper settings.",
  },
  {
    question: "Can children color online?",
    answer:
      "Many pages include an online coloring option. Open a page and look for the available coloring tools and download options.",
  },
  {
    question: "Can teachers use the printables?",
    answer:
      "The pages can be used for personal and classroom coloring activities. Please review our Terms of Use for details about copying and sharing artwork.",
  },
];

export default async function HomePage() {
  const [listing, allCategories] = await Promise.all([
    getPublishedCardPage({ limit: 8, sort: "newest" }),
    getAllPublishedCategories(),
  ]);

  const pages = listing.pages.filter((page) => page.slug && page.categorySlug);
  const categories = allCategories.filter((category) => category.slug);
  const featuredCategories = categories
    .filter((category) => category.pageCount > 0)
    .slice(0, 8);
  const newestPages = [...pages]
    .sort(
      (a, b) =>
        (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
    )
    .slice(0, 8);

  const heroPage = pages.find((page) => Boolean(page.imageUrl));
  const heroCategory = categories.find((category) => Boolean(category.imageUrl));
  const heroImage = heroPage?.imageUrl || heroCategory?.imageUrl || null;
  const heroTitle =
    heroPage?.title || heroCategory?.name || "Your next coloring adventure";
  const heroHref =
    heroPage?.slug && heroPage.categorySlug
      ? "/coloring-pages/" + heroPage.categorySlug + "/" + heroPage.slug + "/"
      : heroCategory?.slug
        ? "/coloring-pages/" + heroCategory.slug + "/"
        : "/coloring-pages/";

  return (
    <div className="min-w-0 overflow-hidden bg-white text-[#302344]">
      {/* Hero: clear search intent and a single strong brand palette. */}
      <section className="relative isolate overflow-hidden bg-[#fbf8ff]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#f4e9ff]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 left-[38%] h-80 w-80 rounded-full bg-[#fff2c7]/70"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-20">
          <div className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e5d5f4] bg-white px-4 py-2 text-xs font-extrabold text-[#70439e] shadow-sm sm:text-sm">
              <Sparkles className="h-4 w-4 text-[#f0a329]" />
              A little color. A lot of imagination.
            </span>
            <h1 className="max-w-2xl text-[clamp(2.55rem,5.3vw,5rem)] font-black leading-[1.04] tracking-[-0.055em] text-[#302344]">
              Free printable coloring pages
              <span className="relative mt-1 block w-fit text-[#7542b2]">
                for little artists.
                <svg
                  className="pointer-events-none absolute -bottom-2 left-0 h-4 w-full text-[#f4bd42]"
                  viewBox="0 0 420 18"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12 Q99 -1 199 10 T413 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-7 max-w-[35rem] text-base leading-8 text-[#655a73] sm:text-lg">
              Discover free coloring pages for kids, from cute animals and
              dinosaurs to princesses, holidays, and more. Print a favorite
              picture or explore creative fun online.
            </p>

            <div className="relative z-30 mt-7 max-w-xl rounded-2xl bg-white p-2 shadow-[0_14px_40px_rgba(69,43,92,0.12)] ring-1 ring-[#e9def2]">
              <SearchBar
                size="lg"
                placeholder="Search animals, dinosaurs, princesses..."
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/coloring-pages/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#7542b2] px-6 py-3 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(117,66,178,0.22)] transition hover:-translate-y-0.5 hover:bg-[#603293]"
              >
                Explore coloring pages <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/printable-coloring-pages/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#dfd0ed] bg-white px-5 py-3 text-sm font-bold text-[#624080] transition hover:bg-[#f8f2ff]"
              >
                <Printer className="h-4 w-4" /> Free printables
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[#71677b] sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-[#7542b2]" /> Free to browse
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-[#7542b2]" /> No account needed
              </span>
              <span className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-[#7542b2]" /> Print or color online
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[550px] lg:max-w-none">
            {heroImage ? (
              <div className="relative mx-auto aspect-[1.06/1] w-full max-w-[570px]">
                <div className="absolute inset-[9%_6%_5%_8%] rotate-[-8deg] rounded-[2.5rem] bg-[#f5c64f] shadow-lg" />
                <div className="absolute inset-[7%_7%_7%_8%] rotate-[5deg] rounded-[2.5rem] bg-[#d9c1f1] shadow-lg" />
                <Link
                  href={heroHref}
                  aria-label={"Open " + heroTitle}
                  className="group absolute inset-[5%_9%_6%_9%] flex -rotate-[2deg] flex-col overflow-hidden rounded-[2rem] border-[8px] border-white bg-white shadow-[0_30px_70px_rgba(69,43,87,0.18)] transition-transform hover:rotate-0"
                >
                  <span className="z-10 flex shrink-0 items-center gap-2 bg-[#f6effd] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[#70439e]">
                    <Sparkles className="h-4 w-4 text-[#e99b22]" /> Featured coloring page
                  </span>
                  <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-4 sm:p-6">
                    <img
                      src={heroImage}
                      alt={heroTitle}
                      className="h-full max-h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                      fetchPriority="high"
                    />
                  </div>
                  <span className="z-10 block truncate bg-white px-5 pb-4 pt-1 text-center text-sm font-extrabold text-[#49346b]">
                    {heroTitle}
                  </span>
                </Link>
                <div className="cc-float pointer-events-none absolute -left-1 top-[16%] rounded-2xl border-4 border-white bg-[#f5c64f] px-4 py-3 text-xs font-black text-[#573b08] shadow-xl sm:-left-4">
                  <span className="mr-1 text-lg" aria-hidden="true">✦</span>
                  Pick a page!
                </div>
                <div className="cc-float-reverse pointer-events-none absolute -right-1 bottom-[17%] rounded-2xl border-4 border-white bg-[#f4eaff] px-4 py-3 text-sm font-black text-[#68418d] shadow-xl sm:-right-4">
                  <span aria-hidden="true">✿</span> Make it yours!
                </div>
              </div>
            ) : (
              <HeroArtwork />
            )}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="relative h-2 bg-gradient-to-r from-[#7542b2] via-[#f5c64f] to-[#e98d35]"
        />
      </section>

      {/* Categories are loaded from the existing published database query. */}
      <section
        id="categories"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-18"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#8654b0]">
              <Sparkles className="h-4 w-4 text-[#e99b22]" /> Find your favorite
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#302344] sm:text-4xl">
              Explore coloring pages by category
            </h2>
            <p className="mt-3 text-base leading-7 text-[#71677b]">
              Choose a theme to find free printable coloring pages for kids.
              There are friendly animals, magical characters, nature scenes,
              and creative ideas for every kind of artist.
            </p>
          </div>
          <Link
            href="/coloring-pages/"
            className="inline-flex items-center gap-2 rounded-full border border-[#dfd0ed] bg-white px-5 py-3 text-sm font-extrabold text-[#70439e] transition hover:bg-[#f8f2ff]"
          >
            Browse all categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredCategories.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.8rem] border-2 border-dashed border-[#dfd0ed] bg-[#fbf8ff] px-6 py-10 text-center text-[#655a73]">
            Our coloring themes are being prepared. Please check back soon for
            more pictures to explore.
          </div>
        )}
      </section>

      {/* Latest published pages. */}
      <section className="bg-[#fbf8ff] py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#8654b0]">
                <Heart className="h-4 w-4 text-[#e98d35]" /> Just added
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#302344] sm:text-4xl">
                New free coloring pages
              </h2>
              <p className="mt-3 leading-7 text-[#71677b]">
                Discover the newest printable coloring pages added to
                CraftColoring. Open a design to print, download, or color
                online when those options are available.
              </p>
            </div>
            <Link
              href="/coloring-pages/"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#7542b2] hover:underline"
            >
              View all pages <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {newestPages.length ? (
            <ColoringGrid pages={newestPages} />
          ) : (
            <div className="rounded-[1.8rem] border border-[#e7dcef] bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f2e8fb] text-[#7542b2]">
                <Palette className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-black text-[#372851]">
                New coloring pages are on the way
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[#776d82]">
                You can explore the available categories while we prepare more
                pictures for the coloring collection.
              </p>
              <Link
                href="#categories"
                className="mt-5 inline-flex items-center gap-2 font-bold text-[#7542b2] underline"
              >
                Browse categories <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Existing name-coloring feature stays connected and available. */}
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-2">
        <NameColoringTeaser />
        <div className="relative overflow-hidden rounded-[2rem] bg-[#fff5d8] px-7 py-9 sm:px-10 sm:py-11">
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -right-12 h-52 w-52 rounded-full bg-[#f4d27b]/55"
          />
          <div className="relative z-10">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#7542b2] shadow-sm">
              <BookOpen className="h-7 w-7" />
            </span>
            <h2 className="mt-6 max-w-sm text-3xl font-black leading-tight tracking-tight text-[#49351f]">
              Creative moments for home and classroom.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#756044] sm:text-base">
              Find a simple activity for a quiet afternoon, a family craft
              session, or a classroom art break. Choose a picture and let every
              child add their own style.
            </p>
            <Link
              href="/about/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#7542b2] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#603293]"
            >
              About CraftColoring <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-8 right-5 hidden rotate-[12deg] text-[8rem] leading-none text-[#e7a832]/25 sm:block"
          >
            ✿
          </div>
        </div>
      </section>

      {/* Simple usage guide. */}
      <section className="border-y border-[#eee5f5] bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-9 max-w-xl text-center">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-[#8654b0]">
              Easy as 1, 2, 3
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#302344] sm:text-4xl">
              How to enjoy your coloring page
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative rounded-[1.7rem] border border-[#eee5f5] bg-[#fcfaff] p-7"
                >
                  <span className="absolute right-7 top-6 text-4xl font-black text-[#eee6f5]">
                    {step.number}
                  </span>
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0e5fb] text-[#7542b2]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-extrabold text-[#342449]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#776b80]">
                    {step.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Helpful answers for visitors and long-tail search intent. */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.18em] text-[#8654b0]">
            Good to know
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#302344] sm:text-4xl">
            Coloring page questions, answered
          </h2>
          <p className="mt-4 max-w-md leading-7 text-[#71677b]">
            Quick answers about free printable coloring pages, printing at
            home, and using the online coloring tools.
          </p>
          <Link
            href="/contact/"
            className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#70439e] hover:underline"
          >
            Still have a question? Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {questions.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-2xl border border-[#ece1ee] bg-white p-5 shadow-sm open:bg-[#fcfaff]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-extrabold text-[#3a2853] [&::-webkit-details-marker]:hidden">
                {question}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2e8fb] text-[#7542b2] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-7 text-[#70647c]">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final branded invitation. */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-18">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-[#55347d] px-7 py-12 text-center text-white sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="absolute -left-12 -top-16 h-56 w-56 rounded-full bg-[#a77bd0]/30 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[#f4c44e]/20 blur-3xl"
          />
          <Star
            className="cc-float pointer-events-none absolute left-[9%] top-[20%] h-8 w-8 text-[#f5cc59]"
            aria-hidden="true"
          />
          <Sparkles
            className="cc-float-reverse pointer-events-none absolute bottom-[21%] right-[11%] h-10 w-10 text-[#f5cc59]"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-extrabold">
              <Heart className="h-4 w-4 fill-[#f5c64f] text-[#f5c64f]" />
              Your next creative moment starts here
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              Ready to find your next favorite coloring page?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Explore free coloring pages, choose a design, and bring it to
              life with your own colors.
            </p>
            <Link
              href="/coloring-pages/"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f5c64f] px-7 py-3 text-sm font-black text-[#49340e] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ffda78]"
            >
              Find a coloring page <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
