"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink, ImageOff, Printer, ShieldCheck } from "lucide-react";

const sheets = [
  {
    title: "Butterfly Coloring Sheet",
    description: "Clean, high-resolution vector butterfly artwork. Print without losing sharpness.",
    category: "Nature & Animals",
    creator: "Fanofw",
    license: "CC0 1.0 — public domain",
    page: "https://commons.wikimedia.org/wiki/File:A_butterfly.svg",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/A_butterfly.svg",
    detail: "3850 × 2316 SVG",
  },
  {
    title: "Floral Mandala Coloring Page",
    description: "A detailed geometric mandala for older kids and adults. Crisp scalable lines.",
    category: "Mandala",
    creator: "Nevit",
    license: "CC BY-SA 4.0 — attribution required",
    page: "https://commons.wikimedia.org/wiki/File:Mandala_drawing_01.svg",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mandala_drawing_01.svg",
    detail: "Vector SVG",
  },
  {
    title: "Detailed Butterfly Line Art",
    description: "Hand-drawn butterfly outlines made for coloring. Original printable vector.",
    category: "Nature & Animals",
    creator: "teck5",
    license: "Openclipart public-domain collection",
    page: "https://openclipart.org/detail/352671/simple-detailed-butterfly-lineart",
    image: "https://openclipart.org/image/800px/352671",
    detail: "Vector SVG",
  },
] as const;

function ArtworkCard({ item }: { item: (typeof sheets)[number] }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="group min-w-0 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(30,26,65,.07)] transition-shadow hover:shadow-[0_15px_40px_rgba(30,26,65,.12)]">
      <div className="relative flex aspect-[4/5] min-h-64 items-center justify-center overflow-hidden bg-[#f8f8fb] p-5 sm:p-7">
        <div className="absolute left-4 top-4 z-10 rounded-full border border-slate-200 bg-white/95 px-3 py-1 text-[11px] font-extrabold text-slate-700 shadow-sm">{item.detail}</div>
        {imageFailed ? (
          <div className="flex flex-col items-center gap-3 px-6 text-center text-slate-500">
            <ImageOff className="h-12 w-12 text-slate-300" aria-hidden="true" />
            <p className="text-sm font-bold">Preview temporarily unavailable</p>
            <a href={item.page} target="_blank" rel="noopener noreferrer" className="text-sm font-black text-violet-700 underline">View original artwork</a>
          </div>
        ) : (
          // External preview is intentionally not cropped. The source page provides the printable original.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.title} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setImageFailed(true)}
            className="block h-full max-h-full w-full object-contain drop-shadow-[0_4px_14px_rgba(15,23,42,.08)]" />
        )}
      </div>
      <div className="space-y-3 border-t border-slate-100 p-5">
        <p className="text-[11px] font-black uppercase tracking-[.12em] text-violet-700">{item.category}</p>
        <h3 className="text-xl font-black leading-tight text-slate-900">{item.title}</h3>
        <p className="min-h-12 text-sm leading-6 text-slate-600">{item.description}</p>
        <p className="text-xs leading-5 text-slate-500">Artwork: {item.creator}<span className="block">{item.license}</span></p>
        <a href={item.page} target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-primary flex w-full items-center justify-center gap-2 text-sm">
          <Printer className="h-4 w-4"/> View & download original <ExternalLink className="h-4 w-4"/>
        </a>
      </div>
    </article>
  );
}

export default function PublicDomainColoringGallery() {
  return (
    <section aria-labelledby="cc-public-domain" className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700"><ShieldCheck className="h-4 w-4"/> Source-linked, license-labelled artwork</span>
          <h2 id="cc-public-domain" className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Printable Vector Coloring Art</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">A smaller selection of detailed, scalable artwork from original creators. Each source page provides the license and the full-resolution download.</p>
        </div>
        <Link href="/printable-coloring-pages/" className="text-sm font-black text-violet-700 underline-offset-4 hover:underline">All printable pages →</Link>
      </div>
      <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sheets.map(item => <ArtworkCard key={item.page} item={item} />)}
      </div>
      <p className="text-xs leading-5 text-slate-500">Images are previews linked to their source; they are not yet imported into the online painting editor. If a source blocks a preview, its original download link stays available.</p>
    </section>
  );
}
