"use client";

import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { ImageUploadField } from "./ImageUploadField";
import type { ColoringSheet } from "@/lib/coloring-sheets";

export default function CollectionSheetsField({ initial = [], value, onChange, onBusyChange }: { initial?: ColoringSheet[]; value?: ColoringSheet[]; onChange?: Dispatch<SetStateAction<ColoringSheet[]>>; onBusyChange?: (busy: boolean) => void }) {
  const [localSheets, setLocalSheets] = useState(initial);
  const sheets = value ?? localSheets;
  const uploadRef = useRef<Record<string, boolean>>({});
  function setSheets(update: (previous: ColoringSheet[]) => ColoringSheet[]) {
    if (onChange) onChange(update); else setLocalSheets(update);
  }
  const [uploads, setUploads] = useState<Record<string, boolean>>({});
  const [dragged, setDragged] = useState<string | null>(null);
  const busy = Object.values(uploads).some(Boolean);
  function patch(id: string, update: Partial<ColoringSheet>) {
    setSheets(previous => previous.map(sheet => sheet.id === id ? { ...sheet, ...update } : sheet));
  }
  function move(from: number, to: number) {
    if (busy || to < 0 || to >= sheets.length) return;
    setSheets(previous => {
      const next = [...previous];
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });
  }
  function uploadStatus(key: string, uploading: boolean) {
    uploadRef.current = { ...uploadRef.current, [key]: uploading };
    onBusyChange?.(Object.values(uploadRef.current).some(Boolean));
    setUploads(uploadRef.current);
  }

  return <section className="space-y-5 rounded-2xl border border-violet-200 bg-violet-50/40 p-4 sm:p-6">
    <div><h2 className="text-xl font-bold text-violet-950">Collection sheets</h2><p className="mt-2 text-sm text-slate-600">The main image above is sheet 1. Add up to 11 more drawings. Drag to reorder, or use the arrow buttons. Every sheet gets its own download and coloring canvas.</p></div>
    <input type="hidden" name="collectionSheets" value={JSON.stringify(sheets)} />
    <input aria-label="Complete all image uploads before saving" className="sr-only" tabIndex={-1} required value={busy || sheets.some(sheet => !sheet.imageUrl) ? "" : "ready"} onChange={() => {}} />
    {sheets.map((sheet, index) => <fieldset key={sheet.id} draggable={!busy} onDragStart={event => { if ((event.target as HTMLElement).closest("input,button")) { event.preventDefault(); return; } setDragged(sheet.id); }} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); if (dragged) move(sheets.findIndex(item => item.id === dragged), index); setDragged(null); }} className="space-y-4 rounded-xl border border-violet-100 bg-white p-4">
      <legend className="px-2 font-bold text-violet-900">Sheet {index + 2}</legend>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy || index === 0} onClick={() => move(index, index - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40" aria-label={`Move sheet ${index + 2} up`}>↑ Up</button>
        <button type="button" disabled={busy || index === sheets.length - 1} onClick={() => move(index, index + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40" aria-label={`Move sheet ${index + 2} down`}>↓ Down</button>
        <button type="button" disabled={busy} onClick={() => setSheets(previous => previous.filter(item => item.id !== sheet.id))} className="ml-auto rounded-lg px-3 py-2 text-red-700">Remove</button>
      </div>
      <label className="block text-sm font-medium">Drawing title<input required maxLength={160} value={sheet.title} onChange={event => patch(sheet.id, { title: event.target.value })} className="mt-1 block w-full rounded-lg border p-3" /></label>
      <label className="block text-sm font-medium">Alt text — describe this drawing<input required maxLength={500} value={sheet.altText} onChange={event => patch(sheet.id, { altText: event.target.value })} className="mt-1 block w-full rounded-lg border p-3" /></label>
      <div className="grid gap-4 md:grid-cols-2">
        <ImageUploadField name={`sheet-image-${sheet.id}`} label="Printable image" profile="coloring" defaultValue={sheet.imageUrl} onUploaded={imageUrl => patch(sheet.id, { imageUrl })} onUploadingChange={value => uploadStatus(`${sheet.id}-image`, value)} />
        <ImageUploadField name={`sheet-svg-${sheet.id}`} label="SVG (optional)" kind="svg" defaultValue={sheet.svgUrl} onUploaded={svgUrl => patch(sheet.id, { svgUrl })} onUploadingChange={value => uploadStatus(`${sheet.id}-svg`, value)} />
      </div>
      {!sheet.imageUrl && <p className="text-sm text-amber-800">Upload an image before saving this sheet.</p>}
    </fieldset>)}
    <button type="button" disabled={busy || sheets.length >= 11} onClick={() => setSheets(previous => [...previous, { id: crypto.randomUUID(), title: "", altText: "", imageUrl: null, svgUrl: null }])} className="rounded-xl bg-violet-700 px-5 py-3 font-bold text-white disabled:opacity-40">+ Add a drawing ({sheets.length + 1}/12)</button>
    {busy && <p role="status" className="text-sm">Uploading artwork… Please wait before saving.</p>}
  </section>;
}
