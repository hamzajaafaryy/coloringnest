"use client";

import { Printer } from "lucide-react";
import { useState } from "react";
import { printArtwork } from "@/lib/coloring/printArtwork";

interface PrintButtonProps {
  title: string;
}

export default function PrintButton({ title }: PrintButtonProps) {
  const [error, setError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const handlePrint = async () => {
    setError("");
    setPreparing(true);
    try {
      await printArtwork(document.getElementById("coloring-artwork"), title);
    } catch {
      setError("Could not prepare the artwork for printing. Please try again.");
    } finally {
      setPreparing(false);
    }
  };

  return (
    <>
    <button
      onClick={handlePrint}
      disabled={preparing}
      className="cc-btn cc-btn-outline w-full min-h-12 px-4 py-3.5"
    >
      <Printer className="w-4 h-4 text-slate-600" />
      <span>{preparing ? "Preparing print preview…" : "Print Coloring Sheet"}</span>
    </button>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    </>
  );
}
