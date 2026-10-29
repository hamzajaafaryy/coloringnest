import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, Palette, Printer, Sparkles } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryCard from "@/components/CategoryCard";
import ColoringGrid from "@/components/ColoringGrid";
import FAQ from "@/components/FAQ";
import {
  getAllPublishedCategories, getCategoryBySlugFromDb,
  getCategoryFaqs, getPublishedColoringPagesByCategorySlug,
} from "@/db/queries";
import { generateBreadcrumbSchema, generateCollectionPageSchema, serializeJsonLd } from "@/lib/seo";

export default async function CategoryCollection({ slug, printable = false }: { slug: string; printable?: boolean }) {
  const category = await getCategoryBySlugFromDb(slug);
  if (!category) notFound();
  const base = printable ? "/printable-coloring-pages" : "/coloring-pages";
  if (slug !== category.slug) permanentRedirect(`${base}/${category.slug}/`);
  const [pages, allCategories, faqs] = await Promise.all([
    getPublishedColoringPagesByCategorySlug(category.slug),
    getAllPublishedCategories(),
    getCategoryFaqs(category.id, category.sourceIds),
  ]);
  const related = allCategories.filter((cat) => cat.slug !== category.slug && cat.pageCount > 0).slice(0, 4);
  const faqItems = faqs.filter((faq) => faq.question && faq.answer)
    .map((faq) => ({ question: faq.question!, answer: faq.answer! }));
  const breadcrumbs = [
    { label: printable ? "Printable Pages" : "Coloring Pages", href: `${base}/` },
    { label: category.name, href: `${base}/${category.slug}/` },
  ];
  return (
    <div className="bg-[#fffdfa] text-[#38294d]">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-7 sm:px-6 sm:py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateBreadcrumbSchema(breadcrumbs)) }} />
        {pages.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateCollectionPageSchema({
          title: category.name,
          description: category.seoDescription || category.description || "Choose a coloring picture to print or color online.",
          path: `/coloring-pages/${category.slug}`,
          items: pages.filter(page => page.slug).map(page => ({ title: page.title, path: `/coloring-pages/${category.slug}/${page.slug}`, image: page.imageUrl })),
        })) }} />}
        <Breadcrumbs items={breadcrumbs} />
        <section className="grid items-center gap-6 rounded-[2rem] border border-[#eadff1] bg-gradient-to-br from-[#f5eaff] via-[#fffbf3] to-[#e5f6ef] p-6 sm:p-9 md:grid-cols-[1fr_160px]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-extrabold text-[#8050a8]">
              {printable ? <Printer className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />} Pick a picture to print
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{printable ? "Printable " : ""}{category.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6e6179]">{category.description || "Choose a picture, grab your crayons, and enjoy a little creative time."}</p>
            <p className="mt-3 text-xs font-bold text-[#8050a8]">{pages.length} {pages.length === 1 ? "picture" : "pictures"} available</p>
          </div>
          {category.imageUrl && <img src={category.imageUrl} alt={category.name} className="mx-auto hidden h-36 w-36 rounded-3xl bg-white p-3 object-contain shadow-sm md:block" />}
        </section>
        <section className="space-y-5">
          <h2 className="text-2xl font-black">Choose your coloring picture</h2>
          {pages.length > 0 ? <ColoringGrid pages={pages} variant={printable ? "printable" : "coloring"} /> : (
            <div className="rounded-3xl border border-dashed border-[#dccaec] bg-white p-8 text-center">
              <Palette className="mx-auto h-10 w-10 text-[#9255cb]" />
              <h3 className="mt-4 text-xl font-bold">This theme is getting ready</h3>
              <p className="mt-2 text-sm text-[#786b81]">New pictures will appear here when they are published. Explore a theme below for something to color today.</p>
              <Link href={`${base}/`} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#8147c8] px-5 py-3 text-sm font-bold text-white">Browse available pictures <ArrowRight className="h-4 w-4" /></Link>
            </div>
          )}
        </section>
        {related.length > 0 && <section className="space-y-5 pb-3">
          <h2 className="text-2xl font-black">More themes with pictures to color</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map((cat) => <CategoryCard key={cat.id} category={cat} variant={printable ? "printable" : "coloring"} />)}</div>
        </section>}
        {faqItems.length > 0 && <FAQ items={faqItems} title={`Questions about ${category.name}`} />}
      </div>
    </div>
  );
}
