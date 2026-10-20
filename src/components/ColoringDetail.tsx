import Link from "next/link";
import { Heart, Printer, Sparkles } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import DownloadButton from "@/components/DownloadButton";
import ImageDownloadButton from "@/components/ImageDownloadButton";
import PrintButton from "@/components/PrintButton";
import SocialShare from "@/components/SocialShare";
import FAQ from "@/components/FAQ";
import RelatedColoringPages from "@/components/RelatedColoringPages";
import { getColoringPageByCategoryAndSlug, getColoringPageFaqs, getRelatedColoringPages } from "@/db/queries";
import { loadColoringSvg } from "@/lib/coloring/loadSvg";
import { sanitizeSvg } from "@/lib/sanitize-svg";
import { generateBreadcrumbSchema, generateImageObjectSchema } from "@/lib/seo";

type Page = NonNullable<Awaited<ReturnType<typeof getColoringPageByCategoryAndSlug>>>;

export default async function ColoringDetail({ page, printable = false }: { page: Page; printable?: boolean }) {
  let svg = "";
  try {
    svg = page.svgContent ? sanitizeSvg(page.svgContent) : await loadColoringSvg(page.svgUrl);
  } catch { /* A malformed SVG must not hide an otherwise printable image. */ }
  const image = page.imageUrl || null;
  const canDownload = Boolean(svg || image);
  const canColor = Boolean(svg);
  const [dbFaqs, related] = await Promise.all([
    getColoringPageFaqs(page.id), getRelatedColoringPages(page.id, page.categoryId, 6),
  ]);
  const base = printable ? "/printable-coloring-pages" : "/coloring-pages";
  const breadcrumbs = [
    { label: printable ? "Printable Pages" : "Coloring Pages", href: `${base}/` },
    { label: page.categoryName || "Coloring Pages", href: `${base}/${page.categorySlug}/` },
    { label: page.title, href: `${base}/${page.categorySlug}/${page.slug}/` },
  ];
  const faqs = dbFaqs.filter((faq) => faq.question && faq.answer)
    .map((faq) => ({ question: faq.question!, answer: faq.answer! }));
  const fallbackFaqs = [
    { question: "Is this coloring page free?", answer: "Yes. You can print this picture for personal and classroom coloring activities without an account. See our Terms of Use for sharing details." },
    { question: "How do I print this picture?", answer: "Select Print Coloring Sheet, choose your printer and paper size, and use the fit-to-page option in your browser's print settings." },
    ...(canDownload ? [{ question: "How do I save this picture?", answer: `Select ${svg ? "Download Printable PNG" : "Download Image"} to save the artwork to your device, then open the saved file whenever you want to print it.` }] : []),
  ];
  const intro = `Print ${page.title.replace(/ coloring page$/i, "").toLowerCase()} and make it your own with crayons, pencils, or markers.`;
  return (
    <div className="bg-[#fffdfa] text-[#38294d]">
      <article className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-9">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)) }} />
        {image && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateImageObjectSchema({ title: page.title, description: page.seoDescription || intro, url: image, category: page.categoryName || "Coloring Pages" })) }} />}
        <Breadcrumbs items={breadcrumbs} />
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <Link href={`${base}/${page.categorySlug}/`} className="rounded-full bg-[#f1e7fb] px-3 py-1.5 text-[#7840b5]">{page.categoryName}</Link>
            {page.ageRange && <span className="rounded-full bg-[#e6f3e7] px-3 py-1.5 text-[#376747]">{page.ageRange}</span>}
            {page.difficulty && <span className="rounded-full bg-[#fff0cf] px-3 py-1.5 text-[#855b20]">{page.difficulty}</span>}
          </div>
          <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">{page.title}</h1>
          <p className="max-w-3xl text-sm leading-7 text-[#73677d] sm:text-base">{intro}</p>
        </div>

        <div id="print" className="no-print grid scroll-mt-28 gap-3 sm:grid-cols-2 lg:max-w-3xl lg:grid-cols-3">
          {(svg || image) && <PrintButton title={page.title} />}
          {svg ? <DownloadButton slug={page.slug!} svgContent={svg} title={page.title} /> : image ? <ImageDownloadButton imageUrl={image} slug={page.slug!} /> : null}
          {canColor && !printable && <Link href={`/color-online/${page.slug}/`} className="cc-btn cc-btn-soft min-h-12"><Sparkles className="h-4 w-4" /> Color Online</Link>}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[2rem] border border-[#e9dfef] bg-[#f6f0fa] p-3 sm:p-5">
            <figure className="printable-artwork flex min-h-64 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 shadow-sm sm:p-5">
              {svg ? <div className="flex w-full items-center justify-center [&>svg]:max-h-[65vh] [&>svg]:w-full [&>svg]:object-contain" dangerouslySetInnerHTML={{ __html: svg }} /> : image ? (
                <img src={image} alt={page.altText || page.title} fetchPriority="high" className="max-h-[65vh] w-full object-contain" />
              ) : <p className="py-16 text-sm text-[#786b81]">This picture is being prepared. Please choose another coloring page below.</p>}
            </figure>
          </div>
          <aside className="no-print space-y-5 rounded-[2rem] border border-[#eee0e9] bg-gradient-to-br from-[#fff4df] via-[#fff9f3] to-[#fbeafa] p-6 sm:p-7">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#a0693c]"><Printer className="h-6 w-6" /></span>
            <h2 className="text-xl font-black">A little coloring time</h2>
            <p className="text-sm leading-7 text-[#77677d]">Pick a comfy spot and your favorite colors. Make the picture bright, soft, silly, or completely your own.</p>
            <ul className="space-y-3 text-sm leading-6 text-[#77677d]">
              {(svg || image) && <li><strong className="text-[#4c355f]">Print:</strong> Choose Print Coloring Sheet, then select your paper size and fit to page.</li>}
              {canDownload && <li><strong className="text-[#4c355f]">Save:</strong> Choose {svg ? "Download Printable PNG" : "Download Image"} to keep a copy on your device.</li>}
              {canColor && !printable && <li><strong className="text-[#4c355f]">Color on screen:</strong> Select Color Online to open the coloring tools.</li>}
            </ul>
            <p className="flex items-center gap-2 border-t border-[#ead9e8] pt-4 text-xs font-semibold text-[#79627d]"><Heart className="h-4 w-4 shrink-0 text-[#bd6b8f]" /> Free for personal and classroom coloring.</p>
          </aside>
        </div>

        <SocialShare title={page.title} imageUrl={image || undefined} />
        {page.description && <section className="max-w-3xl space-y-4 rounded-3xl border border-[#eee5ef] bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-black">About this coloring picture</h2>
          {page.description.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="text-sm leading-8 text-[#73677d] sm:text-base">{paragraph}</p>)}
        </section>}
        <FAQ items={faqs.length ? faqs : fallbackFaqs} title="Before you get your crayons" />
        <RelatedColoringPages pages={related} title="More pictures to color" />
      </article>
    </div>
  );
}
