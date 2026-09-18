import Link from "next/link";

import {
  Sparkles,
  Printer,
  Palette,
  CheckCircle2,
  ArrowRight,
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
  title: "Free Coloring Pages for Kids & Adults (Printable & Online)",
  description:
    "Explore thousands of free printable coloring pages for kids and adults. Color online directly in your browser, print at home, or download PNG sheets.",
  path: "/",
});

const HOMEPAGE_FAQS = [
  {
    question: "Are all coloring pages on ColoringNest free?",
    answer:
      "Yes! 100% of our coloring pages are completely free to color online in your browser, download as high-resolution PNG images, or print at home. No account or registration is required.",
  },
  {
    question: "Can I color pages online without downloading any app?",
    answer:
      "Yes! Our interactive browser coloring tool works instantly on any smartphone, iPad, Android tablet, or desktop computer without installing software.",
  },
  {
    question: "How do I print a coloring page at home?",
    answer:
      "Select any coloring page and click the 'Print' button. Your browser's print window will open with a clean, printer-optimized black-and-white outline ready for standard printer paper.",
  },
  {
    question: "What age groups are these coloring sheets designed for?",
    answer:
      "We offer simple thick-line coloring pages for toddlers and preschoolers (ages 2-5), medium detail sheets for school-aged kids (6-10), and intricate floral/mandala designs for adults.",
  },
];

export default async function HomePage() {
  const [allPages, allCategories] = await Promise.all([
    getAllPublishedColoringPagesWithCategory(),
    getAllPublishedCategories(),
  ]);

  const popularPages = allPages
    .filter((page) => page.popular)
    .slice(0, 8);

  const featuredCategories = allCategories.slice(0, 8);

  const newPages = [...allPages]
    .sort((a, b) => {
      const dateA = a.publishedAt
        ? new Date(a.publishedAt).getTime()
        : 0;

      const dateB = b.publishedAt
        ? new Date(b.publishedAt).getTime()
        : 0;

      return dateB - dateA;
    })
    .slice(0, 4);

  const exampleSearches = [
    {
      label: "Unicorn coloring pages",
      href: "/coloring-pages/unicorn/",
    },
    {
      label: "Dinosaur coloring pages",
      href: "/coloring-pages/dinosaurs/",
    },
    {
      label: "Princess coloring pages",
      href: "/coloring-pages/princesses/",
    },
    {
      label: "Cat coloring pages",
      href: "/coloring-pages/animals/",
    },
    {
      label: "Christmas coloring pages",
      href: "/coloring-pages/christmas/",
    },
    {
      label: "Halloween coloring pages",
      href: "/coloring-pages/halloween/",
    },
  ];

  const faqSchema = generateFAQSchema(HOMEPAGE_FAQS);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <section className="relative py-12 sm:py-20 bg-gradient-to-b from-indigo-50/60 via-purple-50/30 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs sm:text-sm font-semibold border border-indigo-200 shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>100% Free Online & Printable Coloring Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Free Coloring Pages for{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Kids & Adults
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Explore thousands of free coloring pages you can color online,
              print at home, or download as PNG files.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/color-online/unicorn-rainbow-coloring-page/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Start Coloring Online
              </Link>

              <Link
                href="/coloring-pages/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-slate-800 font-bold text-base rounded-2xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
              >
                <Palette className="w-5 h-5 text-indigo-600" />
                Browse Coloring Pages
              </Link>
            </div>

            <div className="pt-6 max-w-2xl mx-auto space-y-3">
              <SearchBar
                placeholder="Search coloring pages (e.g. unicorn, dino, cat)..."
                size="lg"
              />

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-xs text-slate-400 font-semibold mr-1">
                  Popular searches:
                </span>

                {exampleSearches.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-xs bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-200 px-3 py-1 rounded-full border border-slate-200 shadow-2xs transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdPlaceholder
        slotName="Homepage Top Banner"
        format="banner"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Popular Coloring Pages
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                Most downloaded and colored sheets by our community.
              </p>
            </div>

            <Link
              href="/coloring-pages/"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
            >
              View All Coloring Pages
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ColoringGrid pages={popularPages} />
        </section>

        <section className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Coloring Pages by Category
            </h2>

            <p className="text-slate-600 text-sm">
              Discover themed collections from mythical unicorns to outer
              space adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/coloring-pages/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold text-sm rounded-xl border border-slate-200 shadow-xs hover:bg-indigo-50 transition-colors"
            >
              Explore All 20+ Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Browser-Based Interactive Coloring Engine
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Color Directly Online in Your Browser
            </h2>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              No need for paper, crayons, or messy cleanups! ColoringNest
              features an interactive, touch-friendly digital coloring tool.
              Click or tap any closed shape to flood-fill colors instantly,
              use the freehand brush for custom shading, or undo stokes
              anytime.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                "Instant click-to-fill bucket & smooth brush tools",
                "Preset pastel palette + custom RGB hex color picker",
                "Undo, Redo, Zoom, and Clear controls",
                "Works on iPad, Android tablets, mobile, & desktop",
              ].map((benefit, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/color-online/unicorn-rainbow-coloring-page/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-md hover:bg-indigo-700 transition-colors"
              >
                Try Online Coloring Editor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 p-8 rounded-3xl border border-indigo-200/60 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 space-y-4 w-full max-w-md text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-md">
                <Palette className="w-8 h-8" />
              </div>

              <h3 className="font-bold text-slate-900 text-lg">
                Interactive Canvas
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">
                Save your progress directly in your browser. Download
                high-definition PNG files of your finished artwork anytime!
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-indigo-300 text-xs font-semibold">
              <Printer className="w-3.5 h-3.5" />
              Print at Home Easily
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              Free Printable Coloring Pages for Home & School
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Prefer classic crayons, colored pencils, or watercolor markers?
              Download and print any sheet in seconds. Our printable designs
              use sharp vector line art optimized for standard Letter and A4
              paper sizes.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <span className="bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700">
                ✓ Letter & A4 Ready
              </span>

              <span className="bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700">
                ✓ High Resolution 300 DPI
              </span>

              <span className="bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700">
                ✓ Ink-Saving Outlines
              </span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Link
              href="/printable-coloring-pages/"
              className="px-8 py-4 bg-white text-slate-900 font-extrabold text-base rounded-2xl shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <Printer className="w-5 h-5 text-indigo-600" />
              Browse Printable Hub
            </Link>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              New Coloring Pages
            </h2>

            <Link
              href="/coloring-pages/"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-800"
            >
              See All →
            </Link>
          </div>

          <ColoringGrid pages={newPages} />
        </section>

        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Coloring Ideas & Activities
            </h2>

            <p className="text-slate-600 text-sm">
              Tailored coloring pages and learning resources for every
              developmental stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/coloring-pages/preschool/"
              className="p-6 rounded-2xl bg-amber-50 border border-amber-200/80 hover:-translate-y-1 transition-transform group"
            >
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 mb-2">
                Toddlers & Preschool (Ages 2-5)
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Super simple thick outlines, large shapes, alphabet letters,
                and basic cute animals to build early fine motor skills.
              </p>
            </Link>

            <Link
              href="/coloring-pages/kindergarten/"
              className="p-6 rounded-2xl bg-sky-50 border border-sky-200/80 hover:-translate-y-1 transition-transform group"
            >
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 mb-2">
                Kindergarten (Ages 5-7)
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Educational sight word worksheets, count-and-color sheets,
                dinosaurs, and fairytale stories.
              </p>
            </Link>

            <Link
              href="/coloring-pages/adults/"
              className="p-6 rounded-2xl bg-purple-50 border border-purple-200/80 hover:-translate-y-1 transition-transform group"
            >
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 mb-2">
                Adults & Stress Relief
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Intricate botanical art, floral mandalas, zen patterns, and
                detailed wildlife for relaxation and mindfulness.
              </p>
            </Link>
          </div>
        </section>

        <FAQ items={HOMEPAGE_FAQS} />

        <Newsletter />
      </div>
    </div>
  );
}