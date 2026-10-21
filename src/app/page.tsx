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
import {
  getAllPublishedCategories,
  getAllPublishedColoringPagesWithCategory,
} from "@/db/queries";
import { constructMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Free Coloring Pages for Kids to Print | CraftColoring",
  description:
    "Find free coloring pages for kids, from cute animals to make-believe worlds. Choose a picture, print it at home, and enjoy an easy creative break.",
  path: "/",
});

const steps = [
  {
    number: "01",
    title: "Find a picture",
    body: "Explore the themes and pick something that makes you smile.",
    icon: Search,
    background: "bg-[#f8e6fb]",
    ink: "text-[#8a3b9c]",
  },
  {
    number: "02",
    title: "Print your page",
    body: "Open the coloring page and use the Print button when you are ready.",
    icon: Printer,
    background: "bg-[#def1ff]",
    ink: "text-[#256a9c]",
  },
  {
    number: "03",
    title: "Make it yours",
    body: "Grab your crayons or colored pencils. There is no wrong way to color.",
    icon: Paintbrush,
    background: "bg-[#fff0cf]",
    ink: "text-[#aa691f]",
  },
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

export default async function HomePage() {
  const [allPages, allCategories] = await Promise.all([
    getAllPublishedColoringPagesWithCategory(),
    getAllPublishedCategories(),
  ]);

  const pages = allPages.filter((page) => page.slug && page.categorySlug);
  const categories = allCategories.filter((category) => category.slug);
  const featuredCategories = categories.filter((category) => category.pageCount > 0).slice(0, 8);
  const newestPages = [...pages]
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
    .slice(0, 8);

  const heroPage = pages.find((page) => Boolean(page.imageUrl));
  const heroCategory = categories.find((category) => Boolean(category.imageUrl));
  const heroImage = heroPage?.imageUrl || heroCategory?.imageUrl || null;
  const heroTitle = heroPage?.title || heroCategory?.name || "Your next coloring adventure";
  const heroHref = heroPage?.slug && heroPage.categorySlug
    ? "/coloring-pages/" + heroPage.categorySlug + "/" + heroPage.slug + "/"
    : heroCategory?.slug
      ? "/coloring-pages/" + heroCategory.slug + "/"
      : "/coloring-pages/";
  const cornerCategory = categories.find((category) => Boolean(category.imageUrl && category.imageUrl !== heroImage));

  return (
    <div className="min-w-0 overflow-hidden bg-[#fffdfa] text-[#2b2140]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-[#f0e8db] bg-[#fff8ec]">
        <div className="pointer-events-none absolute -left-28 top-24 h-72 w-72 rounded-full bg-[#ffd6e5]/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-[#d6e9ff]/80 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(#dfc9b8 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[1.03fr_0.97fr] lg:gap-8 lg:py-24">
          <div className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#edcc8a] bg-[#fff1b9] px-4 py-2 text-xs font-extrabold tracking-wide text-[#815012] shadow-sm sm:text-sm">
              <Star className="h-4 w-4 fill-current" />
              A happy little corner for creativity
            </div>
            <h1 className="max-w-2xl text-[clamp(2.7rem,5.6vw,5.25rem)] font-black leading-[1.06] tracking-[-0.055em] text-[#2c2045]">
              Free coloring pages for
              <span className="relative mt-1 block w-fit text-[#8a48ce]">
                little artists.
                <svg className="pointer-events-none absolute -bottom-2 left-0 h-4 w-full text-[#ffbb57]" viewBox="0 0 420 18" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M5 12 Q99 -1 199 10 T413 8" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-8 max-w-[35rem] text-base leading-8 text-[#625973] sm:text-lg">
              A cute picture, a box of crayons, and a little imagination.
              Browse easy-to-print coloring pages for kids, parents, and teachers.
              Pick a favorite and let the fun begin.
            </p>

            <div className="relative z-30 mt-7 max-w-xl rounded-[1.4rem] bg-white p-2 shadow-[0_15px_42px_rgba(73,51,97,0.12)] ring-1 ring-[#eadff3]">
              <SearchBar size="lg" placeholder="Try unicorns, animals, dinosaurs..." />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/coloring-pages/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8046cb] px-6 py-3 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(128,70,203,0.24)] transition hover:-translate-y-0.5 hover:bg-[#6733ad]">
                Explore coloring pages <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/printable-coloring-pages/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#e1cde7] bg-white px-5 py-3 text-sm font-bold text-[#5d387f] transition hover:-translate-y-0.5 hover:bg-[#fcf4ff]">
                <Printer className="h-4 w-4" /> Free printables
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-[#70677a] sm:text-sm">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Free to browse</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> No account needed</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Made for coloring time</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[550px] lg:max-w-none">
            {heroImage ? (
              <div className="relative mx-auto aspect-[1.06/1] w-full max-w-[570px]">
                <div className="absolute inset-[9%_6%_5%_8%] rotate-[-10deg] rounded-[2.8rem] bg-[#bee9db] shadow-lg" />
                <div className="absolute inset-[7%_7%_7%_8%] rotate-[7deg] rounded-[2.8rem] bg-[#ffce80] shadow-lg" />
                <Link href={heroHref} aria-label={"Open " + heroTitle} className="group absolute inset-[5%_9%_6%_9%] flex -rotate-[3deg] flex-col overflow-hidden rounded-[2rem] border-[8px] border-white bg-white shadow-[0_32px_75px_rgba(69,43,87,0.2)] transition-transform hover:rotate-0">
                  <span className="z-10 flex shrink-0 items-center gap-2 bg-[#f9f5ff] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[#7649aa]">
                    <Sparkles className="h-4 w-4" /> A peek inside
                  </span>
                  <div className="flex min-h-0 flex-1 items-center justify-center bg-white p-4 sm:p-6">
                    <img src={heroImage} alt={heroTitle} className="h-full max-h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]" fetchPriority="high" />
                  </div>
                  <span className="z-10 block truncate bg-white px-5 pb-4 pt-1 text-center text-sm font-extrabold text-[#49346b]">{heroTitle}</span>
                </Link>
                <div className="cc-float pointer-events-none absolute -left-1 top-[16%] rounded-2xl border-4 border-white bg-[#ffcf71] px-4 py-3 text-xs font-black text-[#624019] shadow-xl sm:-left-4">
                  <span className="mr-1 text-lg" aria-hidden="true">✦</span> Find your favorite!
                </div>
                <div className="cc-float-reverse pointer-events-none absolute -right-1 bottom-[17%] rounded-2xl border-4 border-white bg-[#ddf4e3] px-4 py-3 text-sm font-black text-[#266b4b] shadow-xl sm:-right-4">
                  <span aria-hidden="true">✿</span> Color outside the lines!
                </div>
                {cornerCategory?.imageUrl && <Link href={"/coloring-pages/" + cornerCategory.slug + "/"} aria-label={"Explore " + cornerCategory.name} className="absolute -bottom-2 left-[8%] hidden h-24 w-24 rotate-[-12deg] overflow-hidden rounded-2xl border-[5px] border-white bg-white shadow-2xl transition hover:rotate-0 sm:block">
                  <img src={cornerCategory.imageUrl} alt={cornerCategory.name} className="h-full w-full object-contain" loading="lazy" />
                </Link>}
              </div>
            ) : (
              <HeroArtwork />
            )}
          </div>
        </div>
        <div aria-hidden="true" className="relative h-3 bg-gradient-to-r from-[#fa90ab] via-[#ffd569] via-[#a7dfcd] to-[#aa95fa]" />
      </section>

      {/* Browse categories saved in Supabase */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#8c51b6]">
              <Sparkles className="h-4 w-4" /> Pick a theme
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#2c2045] sm:text-4xl">What shall we color today?</h2>
            <p className="mt-3 text-base leading-7 text-[#756a7b]">Animals, magical friends, nature, and more. Choose a theme and see where your imagination takes you.</p>
          </div>
          <Link href="/coloring-pages/" className="inline-flex items-center gap-2 rounded-full border border-[#dec9f1] bg-white px-5 py-3 text-sm font-extrabold text-[#7840b6] transition hover:bg-[#f8f1ff]">
            See all themes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredCategories.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border-2 border-dashed border-[#e2d3ed] bg-[#fbf6ff] px-6 py-10 text-center text-[#615673]">
            Our themes are being prepared. We will have more pictures to explore soon.
          </div>
        )}
      </section>

      {/* Newly published pages */}
      <section className="bg-[#f7f7ff] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#9d5db5]">
                <Heart className="h-4 w-4" /> Fresh picks
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#2c2045] sm:text-4xl">New pages for your coloring table</h2>
              <p className="mt-3 leading-7 text-[#756a7b]">A few more reasons to pull out the crayons. Find something fun to print and color.</p>
            </div>
            <Link href="/coloring-pages/" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#8046cb] hover:underline">
              View all pages <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {newestPages.length ? (
            <ColoringGrid pages={newestPages} />
          ) : (
            <div className="rounded-[2rem] border border-[#ded4ec] bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f2e5fc] text-[#8046cb]"><Palette className="h-8 w-8" /></div>
              <h3 className="mt-5 text-xl font-black text-[#372851]">Our coloring shelf is getting ready</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[#776d82]">New pictures will be added here as soon as they are published. You can still browse the themes to see what is coming.</p>
              <Link href="#categories" className="mt-5 inline-flex items-center gap-2 font-bold text-[#8046cb] underline">Browse the themes <ChevronRight className="h-4 w-4" /></Link>
            </div>
          )}
        </div>
      </section>

      {/* Dual feature cards */}
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
        <NameColoringTeaser />
        <div className="relative overflow-hidden rounded-[2.2rem] bg-[#e0f1e7] px-7 py-9 sm:px-10 sm:py-11">
          <div aria-hidden="true" className="absolute -bottom-20 -right-12 h-52 w-52 rounded-full bg-[#b2e3ca]/60" />
          <div className="relative z-10">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#387958] shadow-sm"><BookOpen className="h-7 w-7" /></span>
            <h2 className="mt-6 max-w-sm text-3xl font-black leading-tight tracking-tight text-[#284c43]">A little joy for every classroom.</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#516d62] sm:text-base">Looking for a quiet activity at home or at school? A simple picture can be a lovely way to spend time together.</p>
            <Link href="/about/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#284c43] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#386c5b]">
              About CraftColoring <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 right-5 hidden rotate-[12deg] text-[8rem] leading-none opacity-20 sm:block">✿</div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-[#f0e9dd] bg-[#fff9ec] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-9 max-w-xl text-center">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#aa7735]">Let&apos;s get started</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#2c2045] sm:text-4xl">Three easy steps to a colorful day</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative rounded-[1.9rem] border border-[#eee3d7] bg-white p-7 shadow-[0_8px_30px_rgba(53,32,71,0.05)]">
                  <span className="absolute right-7 top-6 text-4xl font-black text-[#f0ebf3]">{step.number}</span>
                  <span className={"inline-flex h-14 w-14 items-center justify-center rounded-2xl " + step.background + " " + step.ink}><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-6 text-xl font-extrabold text-[#342449]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#776b80]">{step.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#a35ba8]">Good to know</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#2c2045] sm:text-4xl">A few quick answers</h2>
          <p className="mt-4 max-w-md leading-7 text-[#786c83]">Everything you need to know before picking your first coloring picture.</p>
          <Link href="/contact/" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#7842ad] hover:underline">More questions? Contact us <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="space-y-3">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group rounded-2xl border border-[#ece1ee] bg-white p-5 shadow-sm open:bg-[#fdfaff]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-extrabold text-[#3a2853] [&::-webkit-details-marker]:hidden">
                {question}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f4e8fc] text-[#8046cb] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-7 text-[#70647c]">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="relative overflow-hidden rounded-[2.4rem] bg-[#4c3176] px-7 py-12 text-center text-white sm:px-12 sm:py-16">
          <div aria-hidden="true" className="absolute -left-12 -top-16 h-56 w-56 rounded-full bg-[#c785f1]/25 blur-2xl" />
          <div aria-hidden="true" className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-[#ffbe85]/20 blur-3xl" />
          <Star className="cc-float pointer-events-none absolute left-[9%] top-[20%] h-8 w-8 text-[#ffe3a4]" aria-hidden="true" />
          <Sparkles className="cc-float-reverse pointer-events-none absolute right-[11%] bottom-[21%] h-10 w-10 text-[#ffc5de]" aria-hidden="true" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-extrabold"><Heart className="h-4 w-4 fill-[#ffb9c9] text-[#ffb9c9]" /> A little creative time</span>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">Ready to make something colorful?</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#e7dcef] sm:text-base">Your next favorite picture might be just a click away.</p>
            <Link href="/coloring-pages/" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ffda8c] px-7 py-3 font-extrabold text-[#4b3264] transition hover:-translate-y-1 hover:bg-[#ffe5b1]">Find a coloring page <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
