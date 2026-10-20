"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";

export default function SvgDownloadButton({ svgContent, slug }: { svgContent: string; slug: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  function download() {
    setError(false);
    try {
      const url = URL.createObjectURL(new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url; link.download = `${slug}.svg`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDone(true); setTimeout(() => setDone(false), 2500);
    } catch { setError(true); }
  }
  return <div><button type="button" onClick={download} className="cc-btn cc-btn-soft min-h-14 w-full px-3">{done ? <Check aria-hidden="true" className="h-4 w-4 shrink-0" /> : <Download aria-hidden="true" className="h-4 w-4 shrink-0" />}<span aria-live="polite">{done ? "SVG downloaded!" : "Download SVG"}</span></button>{error && <p role="alert" className="mt-2 text-sm text-red-700">Unable to download the SVG. Please try again.</p>}</div>;
}
