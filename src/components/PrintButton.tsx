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
      onClick={handlePrint}
      className="cc-btn cc-btn-outline w-full min-h-12 px-4 py-3.5"
    >
      <Printer className="w-4 h-4 text-slate-600" />
      <span>Print Coloring Sheet</span>
    </button>
  );
}
