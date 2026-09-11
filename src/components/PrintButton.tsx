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
      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 shadow-xs transition-all"
    >
      <Printer className="w-4 h-4 text-slate-600" />
      <span>Print Coloring Sheet</span>
    </button>
  );
}
