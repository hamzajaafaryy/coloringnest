import Link from "next/link";
import { Fredoka } from "next/font/google";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Dices,
  Gamepad2,
  Heart,
  Palette,
  Printer,
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

// Rounded, chunky, friendly. Used for headings only; body text keeps the site font.
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Free Coloring Pages for Kids to Print | CraftColoring",
  description:
    "Find free coloring pages for kids, from cute animals to make-believe worlds. Choose a picture, print it at home, and enjoy an easy creative break.",
  path: "/",
});

// Crayon colors. `ink` is the text color that stays readable on each crayon.
const crayons = [
  { bg: "#ff5d73", ink: "#ffffff" },
  { bg: "#ff9f1c", ink: "#3b2300" },
  { bg: "#ffd23f", ink: "#3b2f00" },
  { bg: "#3ecf8e", ink: "#06311f" },
  { bg: "#3aa8ff", ink: "#04263f" },
  { bg: "#8b5cf6", ink: "#ffffff" },
  { bg: "#ff7ab8", ink: "#4a0f2b" },
  { bg: "#2dd4bf", ink: "#053530" },
];

const rainbow = ["#ff5d73", "#ff9f1c", "#ffd23f", "#3ecf8e", "#3aa8ff", "#8b5cf6"];

const steps = [
  { title: "Pick a picture", body: "Tap a theme and choose the one that makes you smile.", emoji: "🔍", bg: "#ffe3ea", edge: "#ff5d73" },
  { title: "Print it out", body: "Open the page and press Print. Ask a grown-up if you need help.", emoji: "🖨️", bg: "#dff0ff", edge: "#3aa8ff" },
  { title: "Color it your way", body: "Crayons, markers, or pencils. There is no wrong way to color!", emoji: "🖍️", bg: "#fff1b8", edge: "#ffb800" },
];

const questions = [
  {
    question: "Are CraftColoring pages free?",
    answer:
      "Yes. You can browse our free coloring pages and print the pictures available in the collection without creating an account.",
  },
  {
    question: "How do I print a coloring page?",
    answer:
      "Choose a picture, open its page, and select the Print button. Your browser will show the printing options for your printer.",
  },
  {
    question: "Can I use these pages with my class?",
    answer:
      "Our printables are intended for personal and classroom coloring activities. Please check our Terms of Use for details about copying and sharing artwork.",
  },
];

function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 420 18" preserveAspectRatio="none" aria-hidden="true">
      <path d="M5 12 Q55 -2 105 10 T205 9 T305 10 T413 8" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

function SectionHeading({ title, text }: { title: string; text?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className={fredoka.className + " text-3xl font-bold leading-tight text-[#2b2140] sm:text-5xl"}>{title}</h2>
      <Squiggle className="mt-2 h-3 w-28 text-[#ffb800]" />
      {text && <p className="mt-4 text-base leading-7 text-[#6a5f78] sm:text-lg">{text}</p>}
    </div>
  );
}

export default async function HomePage() {
  const [listing, allCategories] = await Promise.all([
    getPublishedCardPage({ limit: 8, sort: "newest" }),
    getAllPublishedCategories(),
  ]);

  const pages = listing.pages.filter((page) => page.slug && page.categorySlug);
  const categories = allCategories.filter((category) => category.slug);
  const featuredCategories = categories.filter((category) => category.pageCount > 0).slice(0, 8);
  const crayonCategories = categories.filter((category) => category.pageCount > 0).slice(0, 8);
  const newestPages = [...pages]
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
    .slice(0, 8);

  const heroPage = pages.find((page) => Boolean(page.imageUrl));
  const heroCategory = categories.find((category) => Boolean(category.imageUrl));
  const heroImage = heroPage?.imageUrl || heroCategory?.imageUrl || null;
  const heroTitle = heroPage?.title || heroCategory?.name || "Your next coloring adventure";
  const heroHref =
    heroPage?.slug && heroPage.categorySlug
      ? "/coloring-pages/" + heroPage.categorySlug + "/" + heroPage.slug + "/"
      : heroCategory?.slug
        ? "/coloring-pages/" + heroCategory.slug + "/"
        : "/coloring-pages/";
  const cornerCategory = categories.find((category) => Boolean(category.imageUrl && category.imageUrl !== heroImage));

  return (
    <div className="min-w-0 overflow-hidden bg-[#fffaf0] text-[#2b2140]">
      {/* ───────── Hero ───────── */}
      <section className="relative isolate overflow-hidden bg-[#fff3d6]">
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(#f0c987 1.5px, transparent 1.5px)", backgroundSize: "26px 26px" }} />
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#ffc2d4]/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#b9e0ff]/70 blur-3xl" />

        {/* floating doodles */}
        <span aria-hidden="true" className="cc-float pointer-events-none absolute left-[4%] top-[8%] text-4xl sm:text-5xl">🌈</span>
        <span aria-hidden="true" className="cc-float-reverse pointer-events-none absolute right-[5%] top-[7%] text-4xl sm:text-5xl">⭐</span>
        <span aria-hidden="true" className="cc-float pointer-events-none absolute bottom-[9%] left-[46%] hidden text-4xl sm:block">🦄</span>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:py-24">
          <div className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0">
            <div className="mb-5 inline-flex -rotate-2 items-center gap-2 rounded-full border-2 border-[#2b2140] bg-[#ffd23f] px-4 py-2 text-sm font-extrabold text-[#2b2140] shadow-[3px_3px_0_#2b2140]">
              <Star className="h-4 w-4 fill-current" /> Print. Color. Smile!
            </div>

            <h1 className={fredoka.className + " text-[clamp(2.8rem,7vw,5.6rem)] font-bold leading-[1.02] tracking-tight text-[#2b2140]"}>
              Free coloring pages for{" "}
              <span className="whitespace-nowrap" aria-label="kids">
                {"kids!".split("").map((letter, i) => (
                  <span key={i} aria-hidden="true" className="inline-block transition-transform hover:-translate-y-1 hover:rotate-6" style={{ color: rainbow[i % rainbow.length] }}>
                    {letter}
                  </span>
                ))}
              </span>
            </h1>

            <p className="mt-6 max-w-[34rem] text-base leading-8 text-[#5f5470] sm:text-lg">
              Cute animals, magical friends, and so much more. Pick a picture, print it at home, and grab your crayons!
            </p>

            <div className="relative z-30 mt-7 max-w-xl rounded-3xl border-2 border-[#2b2140] bg-white p-2 shadow-[5px_5px_0_#2b2140]">
              <SearchBar size="lg" placeholder="Try unicorns, dinosaurs, puppies..." />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/coloring-pages/" className="cc-sticker-btn bg-[#ff5d73] text-white">
                Let&apos;s color! <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/surprise-me/" className="cc-sticker-btn bg-[#3ecf8e] text-[#06311f]">
                <Dices className="h-5 w-5" /> Surprise me
              </Link>
              <Link href="/printable-coloring-pages/" className="cc-sticker-btn bg-white text-[#2b2140]">
                <Printer className="h-5 w-5" /> Printables
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-[#5f5470]">
              {["Free to browse", "No account needed", "Print-ready"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3ecf8e] text-white"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[550px] lg:max-w-none">
            {heroImage ? (
              <div className="relative mx-auto aspect-[1.06/1] w-full max-w-[570px]">
                <div className="absolute inset-[9%_6%_5%_8%] rotate-[-9deg] rounded-[2.6rem] border-2 border-[#2b2140] bg-[#8fe3c2]" />
                <div className="absolute inset-[7%_7%_7%_8%] rotate-[6deg] rounded-[2.6rem] border-2 border-[#2b2140] bg-[#ffc861]" />
                <Link
                  href={heroHref}
                  aria-label={"Open " + heroTitle}
                  className="group absolute inset-[5%_9%_6%_9%] flex -rotate-[3deg] flex-col overflow-hidden rounded-[2rem] border-[3px] border-[#2b2140] bg-white shadow-[8px_8px_0_#2b2140] transition-transform hover:rotate-0"
                >
                  <span className={fredoka.className + " flex shrink-0 items-center gap-2 border-b-2 border-[#2b2140] bg-[#ffe27a] px-5 py-2.5 text-base font-bold text-[#2b2140]"}>
                    <Sparkles className="h-4 w-4" /> Color me!
                  </span>
                  <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-4 sm:p-6">
                    <img src={heroImage} alt={heroTitle} className="h-full max-h-full w-full object-contain transition duration-500 group-hover:scale-[1.04]" fetchPriority="high" />
                  </div>
                  <span className={fredoka.className + " block truncate px-5 pb-4 pt-1 text-center text-base font-semibold text-[#2b2140]"}>{heroTitle}</span>
                </Link>
                <div className="cc-float pointer-events-none absolute -left-1 top-[14%] rounded-2xl border-2 border-[#2b2140] bg-[#ff9ccb] px-4 py-2.5 text-sm font-extrabold text-[#4a0f2b] shadow-[3px_3px_0_#2b2140] sm:-left-4">
                  Find your favorite!
                </div>
                <div className="cc-float-reverse pointer-events-none absolute -right-1 bottom-[16%] rounded-2xl border-2 border-[#2b2140] bg-[#b6f0d0] px-4 py-2.5 text-sm font-extrabold text-[#06311f] shadow-[3px_3px_0_#2b2140] sm:-right-4">
                  Color outside the lines!
                </div>
                {cornerCategory?.imageUrl && (
                  <Link
                    href={"/coloring-pages/" + cornerCategory.slug + "/"}
                    aria-label={"Explore " + cornerCategory.name}
                    className="absolute -bottom-2 left-[8%] hidden h-24 w-24 rotate-[-12deg] overflow-hidden rounded-2xl border-[3px] border-[#2b2140] bg-white shadow-[4px_4px_0_#2b2140] transition hover:rotate-0 sm:block"
                  >
                    <img src={cornerCategory.imageUrl} alt={cornerCategory.name} className="h-full w-full object-contain" loading="lazy" />
                  </Link>
                )}
              </div>
            ) : (
              <HeroArtwork />
            )}
          </div>
        </div>

        {/* rainbow edge */}
        <div aria-hidden="true" className="flex h-3 w-full">
          {rainbow.map((color) => (
            <span key={color} className="flex-1" style={{ background: color }} />
          ))}
        </div>
      </section>

      {/* ───────── Crayon box: quick theme links ───────── */}
      {crayonCategories.length > 0 && (
        <section aria-label="Quick themes" className="border-b-2 border-dashed border-[#ecd9b0] bg-[#fffaf0] py-7">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className={fredoka.className + " mb-3 text-lg font-semibold text-[#8a6a2f]"}>Grab a crayon and pick a theme:</p>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              {crayonCategories.map((category, i) => {
                const crayon = crayons[i % crayons.length];
                return (
                  <Link
                    key={category.id}
                    href={"/coloring-pages/" + category.slug + "/"}
                    className={fredoka.className + " cc-crayon"}
                    style={{ backgroundColor: crayon.bg, color: crayon.ink }}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───────── Themes ───────── */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title="What shall we color today?" text="Animals, magical friends, nature, and more. Choose a theme and see where your imagination takes you." />
          <Link href="/coloring-pages/" className="cc-sticker-btn bg-[#8b5cf6] text-white">
            See all themes <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {featuredCategories.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border-2 border-dashed border-[#d9c3f0] bg-[#f8f1ff] px-6 py-10 text-center text-[#615673]">
            Our themes are being prepared. We will have more pictures to explore soon.
          </div>
        )}
      </section>

      {/* ───────── New pages ───────── */}
      <section className="relative bg-[#e8f4ff] py-16 sm:py-20">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2 border-y-2 border-dashed border-[#9ccbf0]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading title="Fresh off the press!" text="Brand-new pictures to print and color. Find something fun and start today." />
            <Link href="/coloring-pages/" className="cc-sticker-btn bg-white text-[#2b2140]">
              View all pages <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          {newestPages.length ? (
            <ColoringGrid pages={newestPages} />
          ) : (
            <div className="rounded-[2rem] border-2 border-[#2b2140] bg-white px-6 py-12 text-center shadow-[6px_6px_0_#2b2140]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffe27a] text-[#2b2140]"><Palette className="h-8 w-8" /></div>
              <h3 className={fredoka.className + " mt-5 text-2xl font-bold text-[#2b2140]"}>Our coloring shelf is getting ready</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[#6a5f78]">New pictures will show up here as soon as they are published. You can still browse the themes to see what is coming.</p>
              <Link href="#categories" className="mt-5 inline-flex items-center gap-2 font-bold text-[#8b5cf6] underline">Browse the themes <ChevronRight className="h-4 w-4" /></Link>
            </div>
          )}
        </div>
      </section>

      {/* ───────── Feature cards ───────── */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
        <NameColoringTeaser />
        <div className="relative overflow-hidden rounded-[2.2rem] border-2 border-[#2b2140] bg-[#c9f2dc] px-7 py-9 shadow-[6px_6px_0_#2b2140] sm:px-10 sm:py-11">
          <div aria-hidden="true" className="absolute -bottom-20 -right-12 h-52 w-52 rounded-full bg-[#8fe3c2]/70" />
          <div className="relative z-10">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#2b2140] bg-white text-[#1f6b4a]"><BookOpen className="h-7 w-7" /></span>
            <h2 className={fredoka.className + " mt-6 max-w-sm text-3xl font-bold leading-tight text-[#173d31] sm:text-4xl"}>A little joy for every classroom.</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#34584b] sm:text-base">Looking for a quiet activity at home or at school? A simple picture is a lovely way to spend time together.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/about/" className="cc-sticker-btn bg-[#173d31] text-white">About CraftColoring <ArrowRight className="h-5 w-5" /></Link>
              <Link href="/play/" className="cc-sticker-btn bg-white text-[#173d31]"><Gamepad2 className="h-5 w-5" /> Play</Link>
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-6 right-6 hidden rotate-[12deg] text-[7rem] leading-none opacity-30 sm:block">🍎</div>
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section className="border-y-2 border-dashed border-[#ecd9b0] bg-[#fff3d6] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <h2 className={fredoka.className + " text-3xl font-bold text-[#2b2140] sm:text-5xl"}>Three easy steps to a colorful day</h2>
            <Squiggle className="mx-auto mt-2 h-3 w-28" />
          </div>
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className={"relative rounded-[1.9rem] border-2 border-[#2b2140] p-7 shadow-[6px_6px_0_#2b2140] " + (i === 1 ? "md:rotate-1" : i === 0 ? "md:-rotate-1" : "md:-rotate-1")}
                style={{ backgroundColor: step.bg }}
              >
                <span className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#2b2140] text-base font-extrabold text-[#2b2140]" style={{ backgroundColor: step.edge }}>
                  {i + 1}
                </span>
                <span className="mt-2 block text-5xl" aria-hidden="true">{step.emoji}</span>
                <h3 className={fredoka.className + " mt-4 text-2xl font-bold text-[#2b2140]"}>{step.title}</h3>
                <p className="mt-2 text-base leading-7 text-[#5a4f68]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── Questions ───────── */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading title="Got a question?" text="Everything you need to know before picking your first coloring picture." />
          <Link href="/contact/" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#7c3aed] hover:underline">
            More questions? Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group rounded-2xl border-2 border-[#2b2140] bg-white p-5 shadow-[4px_4px_0_#2b2140] open:bg-[#fffbe8]">
              <summary className={fredoka.className + " flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-[#2b2140] [&::-webkit-details-marker]:hidden"}>
                {question}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#2b2140] bg-[#ffd23f] text-xl font-bold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 pr-8 text-base leading-7 text-[#5f5470]">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───────── Final call to action ───────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="relative overflow-hidden rounded-[2.4rem] border-2 border-[#2b2140] bg-[#8b5cf6] px-7 py-12 text-center text-white shadow-[8px_8px_0_#2b2140] sm:px-12 sm:py-16">
          <div aria-hidden="true" className="absolute -left-12 -top-16 h-56 w-56 rounded-full bg-[#c4a6ff]/40 blur-2xl" />
          <div aria-hidden="true" className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[#ff9ccb]/30 blur-3xl" />
          <Star className="cc-float pointer-events-none absolute left-[9%] top-[20%] h-9 w-9 fill-[#ffd23f] text-[#ffd23f]" aria-hidden="true" />
          <Sparkles className="cc-float-reverse pointer-events-none absolute bottom-[21%] right-[11%] h-10 w-10 text-[#ffc5de]" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold">
              <Heart className="h-4 w-4 fill-[#ffb9c9] text-[#ffb9c9]" /> Time to get creative
            </span>
            <h2 className={fredoka.className + " mx-auto mt-5 max-w-2xl text-4xl font-bold leading-tight sm:text-6xl"}>Ready to make something colorful?</h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#efe6ff] sm:text-lg">Your next favorite picture is just a tap away.</p>
            <Link href="/coloring-pages/" className="cc-sticker-btn mt-8 bg-[#ffd23f] text-[#2b2140]">
              Find a coloring page <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
