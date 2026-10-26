import { getAdditionalSheets } from "@/db/coloring-sheets";
import { primarySheet } from "@/lib/coloring-sheets";
import ColoringCollection from "./ColoringCollection";
import CollectionDownloadButton from "./CollectionDownloadButton";
import Link from "next/link";
import { Download, Heart, Palette, Printer, Sparkles } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import DownloadButton from "@/components/DownloadButton";
import ImageDownloadButton from "@/components/ImageDownloadButton";
import SvgDownloadButton from "@/components/SvgDownloadButton";
import PrintButton from "@/components/PrintButton";
import SocialShare from "@/components/SocialShare";
import FAQ from "@/components/FAQ";
import RelatedColoringPages from "@/components/RelatedColoringPages";
import { getColoringPageByCategoryAndSlug, getColoringPageFaqs, getRelatedColoringPages } from "@/db/queries";
import { loadColoringSvg } from "@/lib/coloring/loadSvg";
import { sanitizeSvg } from "@/lib/sanitize-svg";
import { getColoringImageAssets } from "@/lib/coloring-image-assets";
import { buildCanonicalUrl, generateBreadcrumbSchema, generateImageObjectSchema } from "@/lib/seo";

type Page = NonNullable<Awaited<ReturnType<typeof getColoringPageByCategoryAndSlug>>>;

export default async function ColoringDetail({ page, printable = false }: { page: Page; printable?: boolean }) {
  let svg = "";
  try {
    svg = page.svgContent ? sanitizeSvg(page.svgContent) : await loadColoringSvg(page.svgUrl);
  } catch { /* A malformed SVG must not hide an otherwise printable image. */ }
  const image = page.imageUrl || null;
  const imageAssets = image ? getColoringImageAssets(image) : null;
  const canDownload = Boolean(svg || image);
  const canColor = Boolean(svg || image);
  const sheets = [primarySheet({ ...page, svgContent: svg }), ...await getAdditionalSheets(page.id)];
  const isCollection = sheets.length > 1;
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
    { question: "How do I print this picture?", answer: isCollection ? "Choose A4 or US Letter, download the complete PDF or an individual drawing, then open the PDF and print the pages you want." : "Select Print Coloring Sheet, choose your printer and paper size, and use the fit-to-page option in your browser's print settings." },
    ...(canDownload ? [{ question: "How do I save this picture?", answer: isCollection ? "Choose Download all PDF to save the collection, or Download PDF below a drawing to save just that page." : `Select ${image ? "Download Image" : "Download Printable PNG"} to save the artwork to your device, then open the saved file whenever you want to print it.` }] : []),
  ];
  const intro = isCollection ? `Choose from ${sheets.length} free coloring pages. Download the complete PDF or color each drawing online.` : canColor
    ? "Print a fresh sheet or color right here in your browser. Pick your favorite way to play."
    : "Print a fresh sheet and make it your own with crayons, pencils, or markers.";
  return (
    <div className="bg-[#fffdfa] text-[#38294d]">
      <article className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-9">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)).replace(/</g, "\\u003c") }} />
        {image && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateImageObjectSchema({ title: page.title, description: page.seoDescription || intro, url: image, category: page.categoryName || "Coloring Pages" })).replace(/</g, "\\u003c") }} />}
        {isCollection && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "CollectionPage",
          "@id": buildCanonicalUrl(`/coloring-pages/${page.categorySlug}/${page.slug}/`),
          name: page.title, description: page.seoDescription || intro,
          mainEntity: { "@type": "ItemList", numberOfItems: sheets.length, itemListElement: sheets.map((sheet, index) => ({
            "@type": "ListItem", position: index + 1,
            item: { "@type": "ImageObject", name: sheet.title, caption: sheet.altText,
              contentUrl: sheet.imageUrl ? new URL(sheet.imageUrl, buildCanonicalUrl("/")).href : undefined,
              url: `${buildCanonicalUrl(`/coloring-pages/${page.categorySlug}/${page.slug}/`)}#sheet-${sheet.id}` }
          })) }
        }).replace(/</g, "\\u003c") }} />}
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

        {isCollection ? <ColoringCollection sheets={sheets} slug={page.slug!} /> : <>
        <div id="print" aria-label="Print, download or color this picture" className="no-print grid scroll-mt-28 grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-4">
          {(svg || image) && <PrintButton title={page.title} imageUrl={image || undefined} />}
          {canColor && <Link href={`/color-online/${page.slug}/`} className="cc-btn cc-btn-primary min-h-14 w-full bg-linear-to-r from-violet-700 via-fuchsia-700 to-rose-700 px-3"><Palette aria-hidden="true" className="h-4 w-4 shrink-0" /> Color Online</Link>}
          {image ? <ImageDownloadButton imageUrl={image} slug={page.slug!} /> : svg ? <DownloadButton slug={page.slug!} svgContent={svg} title={page.title} /> : null}
          {svg && <SvgDownloadButton svgContent={svg} slug={page.slug!} />}
        </div>

        {canDownload && <div className="no-print max-w-md"><CollectionDownloadButton sheets={sheets} slug={page.slug!} label="Download PDF" /></div>}

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-7">
          <div className="min-w-0 rounded-[2rem] border border-[#e9dfef] bg-[#f6f0fa] p-3 sm:p-5">
            <figure className="printable-artwork flex min-h-64 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 shadow-sm sm:p-5">
              {imageAssets ? <picture className="block w-full">
                <source media="print" srcSet={imageAssets.printUrl} />
                <img src={imageAssets.previewUrl} srcSet={imageAssets.srcSet} sizes="(min-width: 1024px) 700px, 100vw" width={imageAssets.width} height={imageAssets.height} alt={page.altText || page.title} fetchPriority="high" className="max-h-[65vh] w-full object-contain" />
              </picture> : svg ? <div role="img" aria-label={page.altText || page.title} className="flex w-full items-center justify-center [&>svg]:max-h-[65vh] [&>svg]:w-full [&>svg]:object-contain" dangerouslySetInnerHTML={{ __html: svg }} /> : <p className="py-16 text-sm text-[#786b81]">This picture is being prepared. Please choose another coloring page below.</p>}
            </figure>
          </div>
          <aside aria-labelledby="coloring-options-title" className="no-print space-y-5 rounded-[2rem] border border-[#eee0e9] bg-gradient-to-br from-[#fff4df] via-[#fff9f3] to-[#fbeafa] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#a0693c]"><Sparkles aria-hidden="true" className="h-5 w-5" /></span>
              <h2 id="coloring-options-title" className="text-xl font-black">Ready, set, color!</h2>
            </div>
            <ul className="space-y-5 text-sm leading-6 text-[#73627a]">
              {canDownload && <li className="flex gap-3"><Printer aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#ad6d27]" /><div><strong className="block text-[#4c355f]">Color on paper</strong>Choose Print Coloring Sheet and use fit to page in your printer settings.</div></li>}
              {canDownload && <li className="flex gap-3"><Download aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#8153b2]" /><div><strong className="block text-[#4c355f]">Keep a copy</strong>{image ? "Download Image" : "Download Printable PNG"} saves the picture to your device.{svg && " Choose Download SVG for sharp outlines at any size."}</div></li>}
              {canColor && <li className="flex gap-3"><Palette aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#bd5a91]" /><div><strong className="block text-[#4c355f]">Play with color online</strong>Choose Color Online to open the brushes and fill bucket. No download needed.</div></li>}
            </ul>
            <p className="flex items-center gap-2 border-t border-[#ead9e8] pt-4 text-xs font-semibold leading-5 text-[#79627d]"><Heart aria-hidden="true" className="h-4 w-4 shrink-0 text-[#bd6b8f]" /> Free for personal and classroom coloring.</p>
          </aside>
        </div>

        </>}

        <SocialShare title={page.title} url={buildCanonicalUrl(`${base}/${page.categorySlug}/${page.slug}/`)} imageUrl={image || undefined} />
        {page.description && <section className="space-y-4 rounded-3xl border border-[#eee5ef] bg-white p-5 sm:p-8 lg:px-12">
          <h2 className="text-2xl font-black">About {isCollection ? "this coloring collection" : "this coloring picture"}</h2>
          {page.description.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="max-w-3xl text-sm leading-8 text-[#73677d] sm:text-base">{paragraph}</p>)}
        </section>}
        <FAQ items={faqs.length ? faqs : fallbackFaqs} title="Before you get your crayons" />
        <RelatedColoringPages pages={related} title="More pictures to color" />
      </article>
    </div>
  );
}
