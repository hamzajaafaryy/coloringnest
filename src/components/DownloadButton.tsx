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
  const [error, setError] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    setCompleted(false);
    setError(false);
    const tempDiv = document.createElement("div");
    try {
      // Create hidden element to render SVG
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.innerHTML = svgContent;
      document.body.appendChild(tempDiv);

      const filename = `${slug}-coloring-page.png`;
      await downloadSvgAsPng(tempDiv, filename, 3);

      setCompleted(true);
      setTimeout(() => setCompleted(false), 2500);
    } catch {
      setError(true);
    } finally {
      tempDiv.remove();
      setDownloading(false);
    }
  };

  return (
    <div><button
      type="button"
      aria-label={completed ? "PNG Downloaded!" : downloading ? "Generating PNG..." : `Download Printable PNG: ${title}`}
      aria-busy={downloading}
      onClick={handleDownload}
      disabled={downloading}
      className="cc-btn cc-btn-dark min-h-14 w-full px-3 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {completed ? (
        <>
          <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-400" />
          <span aria-live="polite">PNG Downloaded!</span>
        </>
      ) : (
        <>
          <Download aria-hidden="true" className="h-4 w-4 shrink-0 text-indigo-400" />
          <span aria-live="polite">{downloading ? "Generating PNG..." : "Download Printable PNG"}</span>
        </>
      )}
    </button>{error && <p role="alert" className="mt-2 text-sm text-red-700">We could not create the PNG. Please try Download SVG or Print Coloring Sheet.</p>}</div>
  );
}
