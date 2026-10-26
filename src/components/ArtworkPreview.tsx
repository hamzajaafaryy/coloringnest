"use client";
import { useRef, useState } from "react";
export default function ArtworkPreview({ src, title, children }: { src: string; title: string; children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" onClick={() => { setOpen(true); dialog.current?.showModal(); }} className="block w-full cursor-zoom-in rounded-2xl focus-visible:outline-2 focus-visible:outline-violet-700" aria-label={`Enlarge ${title}`}>{children}</button>
    <dialog ref={dialog} onClose={() => setOpen(false)} aria-label={title} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} className="fixed inset-0 m-auto max-h-[92dvh] w-[94vw] max-w-3xl overflow-auto rounded-3xl bg-white p-4 shadow-xl backdrop:bg-black/60">
      <div className="sticky top-0 flex items-center justify-between gap-4 bg-white pb-3"><p className="font-bold">{title}</p><button type="button" autoFocus onClick={() => dialog.current?.close()} className="min-h-11 rounded-xl bg-violet-100 px-4 font-bold text-violet-900">Close ✕</button></div>
      {open && <img src={src} alt={title} className="max-h-[75dvh] w-full object-contain" />}
    </dialog>
  </>;
}
