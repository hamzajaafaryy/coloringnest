"use client";

import { Printer } from "lucide-react";

interface PrintButtonProps {
  title: string;
}

export default function PrintButton({ title }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      type="button"
      aria-label={`Print ${title}`}
      onClick={handlePrint}
      className="cc-btn cc-btn-print min-h-14 w-full px-3 py-3.5"
    >
      <Printer aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>Print Coloring Sheet</span>
    </button>
  );
}
