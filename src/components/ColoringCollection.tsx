import Link from "next/link";
import { Palette } from "lucide-react";
import CollectionDownloadButton from "./CollectionDownloadButton";
import ArtworkPreview from "./ArtworkPreview";
import { getColoringImageAssets } from "@/lib/coloring-image-assets";
import { sheetEditorUrl, type ColoringSheet } from "@/lib/coloring-sheets";

export default function ColoringCollection({ sheets, slug }: { sheets: ColoringSheet[]; slug: string }) {
  return <section aria-labelledby="collection-title" className="space-y-6">
    <div className="grid gap-5 rounded-3xl border border-[#eadcf6] bg-gradient-to-br from-[#f3eafa] to-[#fff2cf] p-5 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
      <div><span className="text-xs font-bold uppercase tracking-widest text-violet-700">Pick a picture, make it yours</span><h2 id="collection-title" className="mt-2 text-2xl font-black">{sheets.length} free coloring {sheets.length === 1 ? "page" : "pages"}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#73677d]">Save the whole set for later, or choose a drawing below to download and color. Each drawing prints on its own page.</p></div>
      <CollectionDownloadButton sheets={sheets} slug={slug} label={sheets.length > 1 ? "Download all PDF" : "Download PDF"} />
    </div>
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {sheets.map((sheet, index) => {
        const image = sheet.imageUrl || sheet.svgUrl;
        const assets = image ? getColoringImageAssets(image) : null;
        return <article id={`sheet-${sheet.id}`} key={sheet.id} className="min-w-0 scroll-mt-24 overflow-hidden rounded-3xl border border-[#e9dfef] bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-3 flex items-center justify-between text-xs font-bold text-violet-700"><span className="rounded-full bg-violet-50 px-3 py-1">Sheet {index + 1}</span><a href={`#sheet-${sheet.id}`} aria-label={`Link to ${sheet.title}`}># {index + 1}</a></div>
          {assets ? <ArtworkPreview src={assets.previewUrl} title={sheet.title}><img src={assets.previewUrl} srcSet={assets.srcSet} sizes="(min-width:1280px) 350px, (min-width:768px) 45vw, 90vw" width={assets.width || 850} height={assets.height || 1100} alt={sheet.altText} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} className="aspect-[17/22] w-full rounded-xl bg-white object-contain p-2" /></ArtworkPreview> : sheet.svgContent ? <div role="img" aria-label={sheet.altText} className="aspect-[17/22] overflow-hidden [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: sheet.svgContent }} /> : null}
          <h3 className="mb-4 mt-4 text-lg font-bold leading-snug">{sheet.title}</h3>
          <Link href={sheetEditorUrl(slug, sheet.id)} className="cc-btn cc-btn-primary mb-3 min-h-12 w-full"><Palette aria-hidden="true" className="h-4 w-4" />Color Online</Link>
          <CollectionDownloadButton sheets={[sheet]} slug={`${slug}-${index + 1}`} label="Download PDF" />
        </article>;
      })}
    </div>
  </section>;
}
