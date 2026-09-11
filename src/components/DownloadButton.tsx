"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";
import { downloadSvgAsPng } from "@/lib/coloring/svgUtils";

interface DownloadButtonProps {
  slug: string;
  svgContent: string;
  title: string;
}

export default function DownloadButton({ slug, svgContent, title }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Create hidden element to render SVG
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.innerHTML = svgContent;
      document.body.appendChild(tempDiv);

      const filename = `${slug}-coloring-page.png`;
      await downloadSvgAsPng(tempDiv, filename, 3);
      document.body.removeChild(tempDiv);

      setCompleted(true);
      setTimeout(() => setCompleted(false), 2500);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-sm transition-all disabled:opacity-60"
    >
      {completed ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span>PNG Downloaded!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-indigo-400" />
          <span>{downloading ? "Generating PNG..." : "Download Printable PNG"}</span>
        </>
      )}
    </button>
  );
}
