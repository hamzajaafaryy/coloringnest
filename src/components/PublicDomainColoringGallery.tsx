import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";

const publicDomainSheets = [
  {
    title: "Cat Line Art Coloring Sheet",
    description: "Classic black-and-white cat drawing, suitable for crayons and printing.",
    category: "Animals",
    source: "Openclipart",
    creator: "gammillian",
    license: "CC0 / Public Domain",
    page: "https://openclipart.org/detail/75883/cat-line-art",
    svg: "https://openclipart.org/download/75883",
    image: "https://openclipart.org/image/800px/75883",
  },
  {
    title: "Smiling Rainbow & Cloud Coloring Page",
    description: "A cheerful rainbow and smiling cloud outline for young artists.",
    category: "Nature",
    source: "Wikimedia Commons",
    creator: "Ucoloringpage",
    license: "CC0 1.0",
    page: "https://commons.wikimedia.org/wiki/File:Cute_Rainbow_and_Smiling_Cloud_Coloring_Page.svg",
    svg: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cute_Rainbow_and_Smiling_Cloud_Coloring_Page.svg",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Cute_Rainbow_and_Smiling_Cloud_Coloring_Page.svg",
  },
  {
    title: "Animal Discovery Activity Sheet",
    description: "Find and circle animals in a detailed black-and-white activity page.",
    category: "Animals",
    source: "Wikimedia Commons",
    creator: "Mvolz",
    license: "CC0 1.0",
    page: "https://commons.wikimedia.org/wiki/File:Circle_all_of_the_animals_2.svg",
    svg: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Circle_all_of_the_animals_2.svg",
    image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Circle_all_of_the_animals_2.svg",
  },
] as const;

export default function PublicDomainColoringGallery() {
  return (
    <section aria-labelledby="cc-public-domain" className="min-w-0 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700"><ShieldCheck className="h-4 w-4"/> Individually sourced CC0 artwork</span>
          <h2 id="cc-public-domain" className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Free Public Domain Coloring Sheets</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Browse selected watermark-free coloring sheets from public-domain collections. Open the original file to download or print. Credits and source licenses are shown on each card.</p>
        </div>
        <Link href="/printable-coloring-pages/" className="text-sm font-black text-violet-700 underline-offset-4 hover:underline">Explore more printables →</Link>
      </div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {publicDomainSheets.map(item => (
          <article key={item.page} className="min-w-0 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-white p-5">
              {/* External public-domain art remains on its source server; do not claim it was imported into the editor. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-contain" referrerPolicy="no-referrer"/>
            </div>
            <div className="space-y-3 border-t border-slate-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-violet-600">{item.category} · {item.license}</p>
              <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
              <p className="text-sm leading-6 text-slate-600">{item.description}</p>
              <p className="text-xs text-slate-500">Art: {item.creator} · {item.source}</p>
              <div className="flex flex-wrap gap-2">
                <a href={item.svg} target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-primary text-xs">Open printable SVG <ExternalLink className="h-4 w-4"/></a>
                <a href={item.page} target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-outline text-xs">Source & license</a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="text-xs leading-5 text-slate-500">These sheets are linked from their original sources rather than copied into the CraftColoring database. Some external sources may occasionally be unavailable.</p>
    </section>
  );
}
