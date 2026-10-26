"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import type { ColoringSheet } from "@/lib/coloring-sheets";

export default function CollectionDownloadButton({ sheets, slug, label = "Download all PDF" }: { sheets: ColoringSheet[]; slug: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [paper, setPaper] = useState("letter");
  async function download() {
    if (busy) return;
    setBusy(true);
    try {
      const { PDFDocument, PageSizes } = await import("pdf-lib");
      const pdf = await PDFDocument.create();
      pdf.setTitle(slug.replaceAll("-", " "));
      pdf.setCreator("CraftColoring");
      for (let index = 0; index < sheets.length; index++) {
        setStatus(`Preparing page ${index + 1} of ${sheets.length}…`);
        const sheet = sheets[index];
        let temporary: string | undefined;
        const source = sheet.imageUrl || sheet.svgUrl || (sheet.svgContent ? (temporary = URL.createObjectURL(new Blob([sheet.svgContent], { type: "image/svg+xml" }))) : "");
        if (!source) throw new Error(`Missing artwork for ${sheet.title}.`);
        try {
          const image = new Image();
          image.crossOrigin = "anonymous";
          image.src = source;
          await image.decode();
          const scale = Math.min(1, 2550 / image.naturalWidth, 3300 / image.naturalHeight);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Your browser could not prepare the PDF.");
          context.fillStyle = "white";
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const embedded = await pdf.embedPng(canvas.toDataURL("image/png"));
          const page = pdf.addPage(paper === "a4" ? PageSizes.A4 : PageSizes.Letter);
          const fitted = embedded.scaleToFit(page.getWidth() - 48, page.getHeight() - 48);
          page.drawImage(embedded, { x: (page.getWidth() - fitted.width) / 2, y: (page.getHeight() - fitted.height) / 2, ...fitted });
          canvas.width = canvas.height = 0;
        } finally { if (temporary) URL.revokeObjectURL(temporary); }
      }
      const bytes = await pdf.save();
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url; link.download = `${slug}-${paper}.pdf`;
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setStatus("PDF ready. Check your downloads.");
    } catch (error) {
      console.error("PDF preparation failed", error);
      setStatus("Could not load all artwork. Please check your connection and try again. No incomplete PDF was downloaded.");
    } finally { setBusy(false); }
  }
  return <div className="space-y-2">
    <div className="flex flex-wrap gap-2">
      <select aria-label="PDF paper size" value={paper} onChange={event => setPaper(event.target.value)} disabled={busy} className="min-h-11 rounded-xl border border-violet-200 bg-white px-3 text-sm text-violet-950"><option value="letter">US Letter</option><option value="a4">A4</option></select>
      <button type="button" onClick={download} disabled={busy} className="cc-btn cc-btn-primary min-h-11 flex-1 disabled:opacity-60"><Download className="h-4 w-4 shrink-0" aria-hidden="true" />{busy ? "Preparing…" : label}</button>
    </div>
    <p role="status" className="text-xs leading-5 text-[#73677d]">{status || `${sheets.length} ${sheets.length === 1 ? "page" : "pages"} · Free printable PDF`}</p>
  </div>;
}
