import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Palette,
  Printer,
  Sparkles,
  Star,
} from "lucide-react";

import SearchBar from "@/components/SearchBar";
import ColoringGrid from "@/components/ColoringGrid";
import CategoryCard from "@/components/CategoryCard";
import FAQ from "@/components/FAQ";
import CreativePlayground from "@/components/CreativePlayground";
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

export default async function HomePage() {
  const [allPages, allCategories] = await Promise.all([
    getAllPublishedColoringPagesWithCategory(),
    getAllPublishedCategories(),
  ]);

  const popular = allPages.filter((page) => page.popular);
  const popularPages = (popular.length ? popular : allPages).slice(0, 8);

  const preferredCategories = allCategories.filter(
    (category) => category.featured || category.popular,
  );
  const featuredCategories = (
    preferredCategories.length ? preferredCategories : allCategories
  ).slice(0, 8);

  const newPages = [...allPages]
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime(),
    )
    .slice(0, 4);

  const quickCategories = featuredCategories
    .filter((category) => category.slug)
    .slice(0, 6);

  return (
    <div className="cc-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(HOMEPAGE_FAQS)),
        }}
      />
      <section className="cc-hero">
        <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 items-center gap-6 px-4 pb-10 pt-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-10 lg:px-8 lg:py-16">
          <div className="min-w-0">
            <span className="cc-eyebrow">
              <Star className="h-4 w-4 fill-amber-300 text-amber-700" /> BIG
              IDEAS FOR LITTLE ARTISTS
            </span>
            <h1 className="cc-hero-title mt-5">
              A happy place
              <br />
              to <span className="cc-word-blue">color</span>,{" "}
              <span className="cc-word-coral">play</span>
              <br />
              &amp; imagine.
            </h1>
            <p className="mt-5 max-w-lg text-base font-medium leading-7 text-slate-600 sm:text-lg">
              Free coloring pages for kids, with a world of possibilities. Pick
              a favorite, grab your colors, and make it yours!
            </p>
            <div className="mt-6 flex flex-col gap-3 min-[480px]:flex-row">
              <Link href="/coloring-pages/" className="cc-btn cc-btn-primary">
                <Palette className="h-5 w-5 shrink-0" />
                Let’s color!
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
              <Link
                href="/printable-coloring-pages/"
                className="cc-btn cc-btn-print"
              >
                <Printer className="h-5 w-5 shrink-0" />
                Find printables
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-slate-600">
              {["Always free", "No sign-up", "Made for little hands"].map(
                (text) => (
                  <span key={text} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                    {text}
                  </span>
                ),
              )}
            </div>
          </div>
          <CreativePlayground />
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:space-y-16 sm:px-6 sm:py-12 lg:px-8">
        <section className="cc-discovery" aria-label="Find a coloring page">
          <div className="min-w-0">
            <span className="cc-eyebrow text-blue-700">
              WHAT WILL YOU CREATE TODAY?
            </span>
            <h2 className="mt-2 text-xl font-black text-slate-800 sm:text-2xl">
              Find your next little masterpiece.
            </h2>
          </div>
          <div className="min-w-0 w-full">
            <SearchBar
              placeholder="Search animals, unicorns, dinosaurs…"
              size="lg"
            />
          </div>
        </section>
        {quickCategories.length > 0 && (
          <div
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
            aria-label="Quick themes"
          >
            {quickCategories.map((category, i) => (
              <Link
                key={category.id}
                href={`/coloring-pages/${category.slug}/`}
                className={`cc-theme-chip cc-theme-${i % 4}`}
              >
                <span aria-hidden="true">{["✦", "●", "♥", "★"][i % 4]}</span>
                {category.name}
              </Link>
            ))}
          </div>
        )}

        <section aria-labelledby="popular-heading">
          <div className="cc-section-heading">
            <div>
              <span className="cc-eyebrow text-orange-700">
                A FEW LITTLE FAVORITES
              </span>
              <h2 id="popular-heading" className="mt-2">
                Ready, set, color!
              </h2>
              <p>Find a picture you love. The colors are up to you.</p>
            </div>
            <Link href="/coloring-pages/" className="cc-text-link">
              All coloring pages
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
          <ColoringGrid pages={popularPages} />
        </section>

        <section
          className="cc-theme-section"
          aria-labelledby="categories-heading"
        >
          <div className="cc-section-heading">
            <div>
              <span className="cc-eyebrow text-blue-700">
                A WORLD TO EXPLORE
              </span>
              <h2 id="categories-heading" className="mt-2">
                Follow your imagination.
              </h2>
              <p>
                Big dinosaurs, magical creatures, and everything in between.
              </p>
            </div>
            <span className="cc-star-doodle" aria-hidden="true">
              ✦
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
            {featuredCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        <section className="cc-create-banner">
          <div className="min-w-0">
            <span className="cc-eyebrow text-blue-800">
              TWO WAYS TO MAKE SOMETHING HAPPY
            </span>
            <h2 className="mt-3 text-2xl font-black leading-tight text-slate-800 sm:text-4xl">
              Tiny hands.
              <br />
              Endless possibilities.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
              A quiet afternoon, a classroom activity, or a little creative
              break. There’s a coloring page for every kind of day.
            </p>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/color-online/" className="cc-create-option">
              <span className="cc-option-icon bg-[#dcecff] text-blue-700">
                <Palette className="h-7 w-7" />
              </span>
              <h3>Color on screen</h3>
              <p>Tap, fill, and try a new color. No crayons needed.</p>
              <span className="cc-text-link">
                Start coloring
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              href="/printable-coloring-pages/"
              className="cc-create-option"
            >
              <span className="cc-option-icon bg-[#ffdfd5] text-orange-800">
                <Printer className="h-7 w-7" />
              </span>
              <h3>Print &amp; get creative</h3>
              <p>Bring out the pencils, crayons, and your favorite colors.</p>
              <span className="cc-text-link">
                Pick a printable
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </section>

        {newPages.length > 0 && (
          <section aria-labelledby="new-heading">
            <div className="cc-section-heading">
              <div>
                <span className="cc-eyebrow text-emerald-700">
                  FRESH FROM THE DRAWING TABLE
                </span>
                <h2 id="new-heading" className="mt-2">
                  Something new to love.
                </h2>
              </div>
              <Link href="/coloring-pages/" className="cc-text-link">
                Explore more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ColoringGrid pages={newPages} />
          </section>
        )}
        <AdPlaceholder slotName="Homepage Banner" format="banner" />
        <FAQ items={HOMEPAGE_FAQS} title="A little help for grown-ups" />
        <section className="cc-last-call">
          <Sparkles className="h-8 w-8 shrink-0 text-orange-700" />
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-800 sm:text-2xl">
              The best color? Your favorite.
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              There’s no wrong way to make something yours.
            </p>
          </div>
          <Link href="/coloring-pages/" className="cc-btn cc-btn-primary">
            Find my picture
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
