"use client";

import type { MouseEvent } from "react";

export default function DeleteConfirmButton({ label, name }: { label: string; name: string }) {
  const confirmDelete = (event: MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm(`Delete "${name}" permanently? This cannot be undone.`)) {
      event.preventDefault();
    }
  };

  return (
    <button
      type="submit"
      onClick={confirmDelete}
      className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50 focus-visible:ring-4 focus-visible:ring-red-200"
    >
      {label}
    </button>
  );
}
