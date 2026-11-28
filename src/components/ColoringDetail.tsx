import { getAdditionalSheets } from "@/db/coloring-sheets";
import { primarySheet } from "@/lib/coloring-sheets";
import ColoringCollection from "./ColoringCollection";
import CollectionDownloadButton from "./CollectionDownloadButton";
import Link from "next/link";
import LegacyResponsiveImage from "@/components/LegacyResponsiveImage";
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
import { canOptimizeLegacyImage, getColoringImageAssets } from "@/lib/coloring-image-assets";
import { buildCanonicalUrl, generateBreadcrumbSchema, generateImageObjectSchema, generateColoringCreativeWorkSchema, serializeJsonLd } from "@/lib/seo";

type Page = NonNullable<Awaited<ReturnType<typeof getColoringPageByCategoryAndSlug>>>;

export default async function ColoringDetail({ page, printable = false }: { page: Page; printable?: boolean }) {
  let svg = "";
  try {
    svg = page.svgContent ? sanitizeSvg(page.svgContent) : await loadColoringSvg(page.svgUrl);
  } catch { /* A malformed SVG must not hide an otherwise printable image. */ }
  const image = page.imageUrl || null;
  const imageAssets = image ? getColoringImageAssets(image) : null;
  const optimizeLegacy = image ? canOptimizeLegacyImage(image, process.env.SUPABASE_URL) : false;
  const canDownload = Boolean(svg || image);
  const canColor = Boolean(svg || image);
  const sheets = [primarySheet({ ...page, svgContent: svg }), ...await getAdditionalSheets(page.id)];
  const isCollection = sheets.length > 1;
  const canonicalUrl = buildCanonicalUrl(`/coloring-pages/${page.categorySlug}/${page.slug}`);
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
  const materials = page.whatYoullNeed?.filter((item) => item.trim()) ?? [];
  const coloringIdeas = page.funColoringIdeas?.filter((item) => item.trim()) ?? [];
  const printingTips = page.printingTips?.filter((item) => item.trim()) ?? [];
  const learningActivity = page.learningActivity?.title?.trim() &&
    page.learningActivity.description?.trim() && page.learningActivity.activity?.trim()
    ? page.learningActivity : null;
  const makeItYourOwn = page.makeItYourOwn?.description?.trim() && page.makeItYourOwn.challenge?.trim()
    ? page.makeItYourOwn : null;
  const hasSections = Boolean(page.meetYourColoringPage?.trim() || materials.length || coloringIdeas.length ||
    learningActivity || makeItYourOwn || printingTips.length);
  const fallbackFaqs = [
    { question: "Is this coloring page free?", answer: "Yes. You can print this picture for personal and classroom coloring activities without an account. See our Terms of Use for sharing details." },
    { question: "How do I print this picture?", answer: isCollection ? "Choose A4 or US Letter, download the complete PDF or an individual drawing, then open the PDF and print the pages you want." : "Select Print Coloring Sheet, choose your printer and paper size, and use the fit-to-page option in your browser's print settings." },
    ...(canDownload ? [{ question: "How do I save this picture?", answer: isCollection ? "Choose Download all PDF to save the collection, or Download PDF below a drawing to save just that page." : `Select ${image ? "Download Image" : "Download Printable PNG"} to save the artwork to your device, then open the saved file whenever you want to print it.` }] : []),
  ];
  const intro = isCollection ? `Choose from ${sheets.length} free coloring pages. Download the complete PDF or color each drawing online.` : canColor
    ? "Print a fresh sheet or color right here in your browser. Pick your favorite way to play."
    : "Print a fresh sheet and make it your own with crayons, pencils, or markers.";
  return (
    <div className="bg-[#fffaf0] text-[#2b2140]">
      <article className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-9">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateBreadcrumbSchema(breadcrumbs)) }} />
        {image && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateImageObjectSchema({ title: page.title, description: page.seoDescription || intro, url: image, category: page.categoryName || "Coloring Pages", pageUrl: canonicalUrl })) }} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
          "@context": "https://schema.org", "@type": isCollection ? "CollectionPage" : "WebPage",
          "@id": canonicalUrl,
          url: canonicalUrl,
          name: page.title, description: page.seoDescription || intro,
          ...(image ? { primaryImageOfPage: { "@id": `${canonicalUrl}#artwork` } } : {}),
          ...(isCollection ? { mainEntity: { "@type": "ItemList", numberOfItems: sheets.length, itemListElement: sheets.map((sheet, index) => ({
            "@type": "ListItem", position: index + 1,
            item: { "@type": "ImageObject", name: sheet.title, caption: sheet.altText,
              contentUrl: sheet.imageUrl ? new URL(sheet.imageUrl, `${buildCanonicalUrl("/")}/`).href : undefined,
              url: `${canonicalUrl}#sheet-${sheet.id}` }
          })) } } : {}),
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateColoringCreativeWorkSchema({
          title: page.title,
          description: page.description || page.seoDescription || intro,
          path: `/coloring-pages/${page.categorySlug}/${page.slug}`,
          image,
          category: page.categoryName,
          ageRange: page.ageRange,
        })) }} />
        <Breadcrumbs items={breadcrumbs} />
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <Link href={`${base}/${page.categorySlug}/`} className="rounded-full border-2 border-[#2b2140] bg-[#c4a8f8] px-3 py-1.5 text-[#2b2140]">{page.categoryName}</Link>
            {page.ageRange && <span className="rounded-full border-2 border-[#2b2140] bg-[#c9f2dc] px-3 py-1.5 text-[#2b2140]">{page.ageRange}</span>}
            {page.difficulty && <span className="rounded-full border-2 border-[#2b2140] bg-[#ffd23f] px-3 py-1.5 text-[#2b2140]">{page.difficulty}</span>}
          </div>
          <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">{page.title}</h1>
          <p className="max-w-3xl text-sm leading-7 text-[#73677d] sm:text-base">{intro}</p>
          {(page.categoryName || page.ageRange || page.difficulty) && (
            <section aria-label="Coloring page details" className="max-w-3xl rounded-2xl border-2 border-[#2b2140] bg-white p-4 shadow-[4px_4px_0_rgba(43,33,64,0.14)] sm:p-5">
              <h2 className="mb-3 text-base font-black text-[#4c355f]">Coloring page details</h2>
              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                {page.categoryName && <div><dt className="font-semibold text-[#73677d]">Category</dt><dd className="mt-1 font-bold text-[#4c355f]"><Link href={`/coloring-pages/${page.categorySlug}/`} className="underline underline-offset-2">{page.categoryName}</Link></dd></div>}
                {page.ageRange && <div><dt className="font-semibold text-[#73677d]">Suggested ages</dt><dd className="mt-1 font-bold text-[#4c355f]">{page.ageRange.replace(/^Suggested ages?\s*/i, "")}</dd></div>}
                {page.difficulty && <div><dt className="font-semibold text-[#73677d]">Difficulty</dt><dd className="mt-1 font-bold text-[#4c355f]">{page.difficulty}</dd></div>}
              </dl>
            </section>
          )}
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
          <div className="min-w-0 rounded-[2rem] border-2 border-[#2b2140] bg-[#c4a8f8] p-3 shadow-[6px_6px_0_rgba(43,33,64,0.16)] sm:p-5">
            <figure className="printable-artwork flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#2b2140] bg-white p-3 shadow-[3px_3px_0_#2b2140] sm:p-5">
              {imageAssets ? <picture className="block w-full">
                <source media="print" srcSet={imageAssets.printUrl} />
                {optimizeLegacy ? <LegacyResponsiveImage src={imageAssets.previewUrl} alt={page.altText || page.title}
                  width={1200} height={1553} quality={85} sizes="(min-width: 1024px) 700px, 100vw"
                  fetchPriority="high" loading="eager" className="max-h-[65vh] h-auto w-full object-contain" /> :
                  <img src={imageAssets.previewUrl} srcSet={imageAssets.srcSet} sizes="(min-width: 1024px) 700px, 100vw" width={imageAssets.width} height={imageAssets.height} alt={page.altText || page.title} fetchPriority="high" className="max-h-[65vh] w-full object-contain" />}
              </picture> : svg ? <div role="img" aria-label={page.altText || page.title} className="flex w-full items-center justify-center [&>svg]:max-h-[65vh] [&>svg]:w-full [&>svg]:object-contain" dangerouslySetInnerHTML={{ __html: svg }} /> : <p className="py-16 text-sm text-[#786b81]">This picture is being prepared. Please choose another coloring page below.</p>}
            </figure>
          </div>
          <aside aria-labelledby="coloring-options-title" className="no-print space-y-5 rounded-[2rem] border-2 border-[#2b2140] bg-[#c9f2dc] p-5 shadow-[6px_6px_0_rgba(43,33,64,0.16)] sm:p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#2b2140] bg-[#ffd23f] text-[#2b2140]"><Sparkles aria-hidden="true" className="h-5 w-5" /></span>
              <h2 id="coloring-options-title" className="text-xl font-black">Ready, set, color!</h2>
            </div>
            <ul className="space-y-5 text-sm leading-7 text-[#2b2140]">
              {canDownload && <li className="flex gap-3"><Printer aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#2b2140]" /><div><strong className="block text-[#2b2140]">Color on paper</strong>Choose Print Coloring Sheet and use fit to page in your printer settings.</div></li>}
              {canDownload && <li className="flex gap-3"><Download aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#2b2140]" /><div><strong className="block text-[#2b2140]">Keep a copy</strong>{image ? "Download Image" : "Download Printable PNG"} saves the picture to your device.{svg && " Choose Download SVG for sharp outlines at any size."}</div></li>}
              {canColor && <li className="flex gap-3"><Palette aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#2b2140]" /><div><strong className="block text-[#2b2140]">Play with color online</strong>Choose Color Online to open the brushes and fill bucket. No download needed.</div></li>}
            </ul>
            <p className="flex items-center gap-2 border-t-2 border-[#2b2140]/20 pt-4 text-xs font-semibold leading-5 text-[#2b2140]"><Heart aria-hidden="true" className="h-4 w-4 shrink-0 text-[#2b2140]" /> Free for personal and classroom coloring.</p>
          </aside>
        </div>

        </>}

        <SocialShare title={page.title} url={canonicalUrl} imageUrl={image || undefined} />
        {page.description && <section className="space-y-4 rounded-3xl border-2 border-[#2b2140] bg-white p-5 shadow-[5px_5px_0_rgba(43,33,64,0.14)] sm:p-8 lg:px-12">
          <h2 className="text-2xl font-black">About {isCollection ? "this coloring collection" : "this coloring picture"}</h2>
          {page.description.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="max-w-3xl text-sm leading-8 text-[#514461] sm:text-base">{paragraph}</p>)}
        </section>}
        {hasSections && <section aria-label="Coloring page guide" className="grid gap-4 md:grid-cols-2">
          {page.meetYourColoringPage?.trim() && <div className="rounded-3xl border-2 border-[#2b2140] bg-white p-5 shadow-[4px_4px_0_rgba(43,33,64,0.12)] sm:p-6">
            <h2 className="text-xl font-black">Meet your coloring page</h2>
            <p className="mt-3 text-sm leading-7 text-[#514461]">{page.meetYourColoringPage}</p>
          </div>}
          {materials.length > 0 && <div className="rounded-3xl border-2 border-[#2b2140] bg-[#c9f2dc] p-5 shadow-[4px_4px_0_rgba(43,33,64,0.12)] sm:p-6">
            <h2 className="text-xl font-black">What you&apos;ll need</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-[#2b2140]">{materials.map((item, index) => <li key={index}>{item}</li>)}</ul>
          </div>}
          {coloringIdeas.length > 0 && <div className="rounded-3xl border-2 border-[#2b2140] bg-[#fff0c2] p-5 shadow-[4px_4px_0_rgba(43,33,64,0.12)] sm:p-6">
            <h2 className="text-xl font-black">Fun coloring ideas</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-[#2b2140]">{coloringIdeas.map((idea, index) => <li key={index}>{idea}</li>)}</ul>
          </div>}
          {learningActivity && <div className="rounded-3xl border-2 border-[#2b2140] bg-[#e9ddff] p-5 shadow-[4px_4px_0_rgba(43,33,64,0.12)] sm:p-6">
            <h2 className="text-xl font-black">{learningActivity.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#514461]">{learningActivity.description}</p>
            <p className="mt-3 text-sm leading-7 text-[#514461]"><strong>Try it:</strong> {learningActivity.activity}</p>
          </div>}
          {makeItYourOwn && <div className="rounded-3xl border-2 border-[#2b2140] bg-[#ffdbe5] p-5 shadow-[4px_4px_0_rgba(43,33,64,0.12)] sm:p-6">
            <h2 className="text-xl font-black">Make it your own</h2>
            <p className="mt-3 text-sm leading-7 text-[#514461]">{makeItYourOwn.description}</p>
            <p className="mt-3 text-sm leading-7 text-[#514461]"><strong>Challenge:</strong> {makeItYourOwn.challenge}</p>
          </div>}
          {printingTips.length > 0 && <div className="rounded-3xl border-2 border-[#2b2140] bg-[#c4a8f8] p-5 shadow-[4px_4px_0_rgba(43,33,64,0.12)] sm:p-6">
            <h2 className="text-xl font-black">Printing tips</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-[#2b2140]">{printingTips.map((tip, index) => <li key={index}>{tip}</li>)}</ul>
          </div>}
        </section>}
        <FAQ items={faqs.length ? faqs : fallbackFaqs} title="Before you get your crayons" />
        <RelatedColoringPages pages={related} title="More pictures to color" />
      </article>
    </div>
  );
}
