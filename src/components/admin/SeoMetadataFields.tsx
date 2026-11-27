"use client";

import { useState } from "react";

function SeoField({
  label,
  name,
  initialValue,
  min,
  max,
  hint,
}: {
  label: string;
  name: string;
  initialValue?: string | null;
  min: number;
  max: number;
  hint: string;
}) {
  const [value, setValue] = useState(initialValue ?? "");

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        name={name}
        value={value}
        maxLength={max}
        onChange={event => setValue(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
      <span className="mt-1 block text-xs text-slate-500">
        {value.length} / {max} characters · Recommended {min}–{max}. {hint}
      </span>
    </label>
  );
}

export default function SeoMetadataFields({
  seoTitle,
  seoDescription,
}: {
  seoTitle?: string | null;
  seoDescription?: string | null;
}) {
  return (
    <section className="grid gap-5 md:grid-cols-2">
      <SeoField
        label="SEO title"
        name="seoTitle"
        initialValue={seoTitle}
        min={45}
        max={60}
        hint="Include the subject; the site adds or normalizes the CraftColoring suffix."
      />
      <SeoField
        label="SEO description"
        name="seoDescription"
        initialValue={seoDescription}
        min={140}
        max={160}
        hint="Summarize this page naturally; this is editorial guidance, not a Google ranking rule."
      />
    </section>
  );
}
