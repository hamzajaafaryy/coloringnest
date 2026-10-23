"use client";

import { Printer } from "lucide-react";
import { useState } from "react";

interface PrintButtonProps {
  title: string;
  imageUrl?: string;
}

export default function PrintButton({ title, imageUrl }: PrintButtonProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const handlePrint = async () => {
    setBusy(true);
    setError(false);
    try {
      if (imageUrl) {
        // Cache the print source before switching the picture element to print media.
        const image = new Image();
        image.src = imageUrl;
        await image.decode();
      }
      window.print();
    } catch { setError(true); }
    finally { setBusy(false); }
  };

  return (
    <div><button
      type="button"
      aria-label={`Print ${title}`}
      onClick={() => void handlePrint()}
      disabled={busy}
      aria-busy={busy}
      className="cc-btn cc-btn-print min-h-14 w-full px-3 py-3.5"
    >
      <Printer aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span aria-live="polite">{busy ? "Preparing print…" : "Print Coloring Sheet"}</span>
    </button>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">The print image could not load. Please try again.</p>}</div>
  );
}
