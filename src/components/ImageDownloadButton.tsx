"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";

export default function ImageDownloadButton({ imageUrl, slug }: { imageUrl: string; slug: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  async function download() {
    setBusy(true);
    setError(false);
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      if (!blob.type.startsWith("image/")) throw new Error("Invalid image");
      const extension = ({ "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg" } as Record<string, string>)[blob.type] || "png";
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return <div>
    <button type="button" disabled={busy} onClick={() => void download()} className="cc-btn cc-btn-dark w-full min-h-12 disabled:opacity-60">
      {done ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
      {busy ? "Downloading…" : done ? "Image downloaded!" : "Download Image"}
    </button>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">We could not download the image. <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline">Open it to save it</a>.</p>}
  </div>;
}
