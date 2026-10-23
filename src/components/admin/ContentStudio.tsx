"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { buildStudioPrompt } from "@/lib/content-studio-prompt";
import { fieldCount, SEO_RULES, validateStudioSeo } from "@/lib/content-studio-seo";
import { canonicalCategorySlug } from "@/lib/category-catalog";
import { validateColoringSvg } from "@/lib/coloring/validateSvg";
import { getColoringImageAssets } from "@/lib/coloring-image-assets";
import { IMAGE_TYPES, MAX_IMAGE_SOURCE_BYTES, MAX_SVG_UPLOAD_BYTES, prepareImageFile } from "@/lib/image-upload";

type Draft = { id: number; title: string; imageUrl: string | null };

export default function ContentStudio() {
  const [file, setFile] = useState<File | null>(null);
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [json, setJson] = useState("");
  const [message, setMessage] = useState("");
  const [assetError, setAssetError] = useState("");
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [inputKey, setInputKey] = useState(0);
  const [publishedUrl, setPublishedUrl] = useState("");
  const uploaded = useRef<{ image?: { file: File; url: string; warning?: string }; svg?: { file: File; url: string; warning?: string } }>({});
  const saving = useRef(false);
  const svgInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/content-studio", { cache: "no-store", signal: controller.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("Unable to load drafts. Refresh or sign in again.")))
      .then(data => { if (Array.isArray(data.drafts)) setDrafts(data.drafts); })
      .catch(error => { if (!controller.signal.aborted) setMessage(error instanceof Error ? error.message : "Unable to load drafts."); });
    return () => controller.abort();
  }, []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const validation = useMemo(() => {
    if (!json.trim()) return { seo: null, issues: [], parseError: "" };
    try { return { ...validateStudioSeo(JSON.parse(json)), parseError: "" }; }
    catch { return { seo: null, issues: [], parseError: "Invalid JSON. Paste one complete JSON object without Markdown fences." }; }
  }, [json]);
  const { seo, issues, parseError } = validation;
  const valid = Boolean(file && seo && !issues.length && !parseError && !assetError);

  function chooseImage(selected?: File) {
    setAssetError(""); setPublishedUrl("");
    if (!selected) { setFile(null); setPreview(""); return; }
    if (!IMAGE_TYPES.includes(selected.type) || selected.size > MAX_IMAGE_SOURCE_BYTES || selected.size === 0) {
      setFile(null); setPreview(""); setAssetError("Choose a PNG, JPG, or WebP image between 1 byte and 20 MB."); return;
    }
    setFile(selected); setPreview(URL.createObjectURL(selected));
  }
  async function chooseSvg(selected?: File) {
    setAssetError(""); uploaded.current.svg = undefined;
    if (!selected) { setSvgFile(null); return; }
    setSvgFile(null);
    if ((!selected.name.toLowerCase().endsWith(".svg") && selected.type !== "image/svg+xml") || selected.size > MAX_SVG_UPLOAD_BYTES || selected.size === 0) {
      setAssetError("Choose a vector SVG file between 1 byte and 2 MB."); return;
    }
    try {
      validateColoringSvg(await selected.text());
      setSvgFile(selected.type === "image/svg+xml" ? selected : new File([selected], selected.name, { type: "image/svg+xml" }));
    } catch (error) { setAssetError(error instanceof Error ? error.message : "Invalid SVG."); }
  }
  async function chooseJson(selected?: File) {
    if (!selected) return;
    if (selected.size > 1024 * 1024) { setMessage("JSON file must be 1 MB or smaller."); return; }
    try { setJson(await selected.text()); setMessage(""); }
    catch { setMessage("Could not read this JSON file. Paste its contents instead."); }
  }
  async function copyPrompt() {
    try { await navigator.clipboard.writeText(buildStudioPrompt(Boolean(svgFile))); setMessage("Master Prompt copied with the current image/SVG features."); }
    catch { setMessage("Clipboard unavailable. Open the prompt below and copy it manually."); }
  }
  async function upload(selected: File, kind: "image" | "svg", slug: string) {
    const cached = uploaded.current[kind];
    if (cached?.file === selected) return cached.url;
    const form = new FormData();
    const prepared = kind === "image" ? await prepareImageFile(selected) : selected;
    form.append("file", prepared); form.append("slug", slug); form.append("kind", kind); form.append("profile", "coloring");
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await response.json();
    if (!response.ok || !data.url) throw new Error(data.error || `${kind} upload failed.`);
    uploaded.current[kind] = { file: selected, url: data.url, warning: data.warning };
    return data.url as string;
  }
  async function submit(publish: boolean) {
    if (!valid || !file || !seo || saving.current) return;
    saving.current = true; setBusy(true); setPublishedUrl("");
    try {
      setMessage("Checking SEO and URL before uploading…");
      const check = await fetch("/api/admin/content-studio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "validateJson", seo }) });
      const checked = await check.json();
      if (!check.ok) throw new Error(checked.error || "SEO validation failed.");
      setMessage("Uploading printable image…");
      const imageUrl = await upload(file, "image", seo.slug);
      let svgUrl: string | null = null;
      if (svgFile) { setMessage("Uploading vector SVG…"); svgUrl = await upload(svgFile, "svg", seo.slug); }
      setMessage("Saving content and FAQs…");
      const response = await fetch("/api/admin/content-studio", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "importJson", imageUrl, svgUrl, seo, publish }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Save failed.");
      setMessage(`${publish ? "Published" : "Draft saved"} successfully. ${svgFile ? "Print, image download, SVG download, and online coloring are available when published." : "Print and image download are available when published."}${uploaded.current.image?.warning ? ` ${uploaded.current.image.warning}` : ""}`);
      if (publish) setPublishedUrl(`/coloring-pages/${result.categorySlug}/${seo.slug}/`);
      else setDrafts(old => [{ id: result.id, title: seo.title, imageUrl }, ...old]);
      setFile(null); setSvgFile(null); setPreview(""); setJson(""); uploaded.current = {}; setInputKey(old => old + 1);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Save failed. Your inputs are kept so you can retry."); }
    finally { saving.current = false; setBusy(false); }
  }

  return <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
    <header><h1 className="text-3xl font-black">Content Studio — Image + SEO JSON</h1><p className="mt-2 text-slate-600">A printable image is required. Add an optional SVG to enable online coloring, then paste your SEO JSON.</p></header>
    <div className="grid gap-3 text-sm sm:grid-cols-3">
      <div className="rounded-2xl border bg-orange-50 p-4"><strong>Print</strong><p className="mt-1">Opens the browser print settings.</p></div>
      <div className="rounded-2xl border bg-sky-50 p-4"><strong>Download</strong><p className="mt-1">Saves the image, or the vector SVG when supplied.</p></div>
      <div className="rounded-2xl border bg-violet-50 p-4"><strong>Color Online</strong><p className="mt-1">Opens coloring tools in the browser. Requires SVG.</p></div>
    </div>
    <fieldset disabled={busy} className="space-y-6 disabled:opacity-70">
      <section className="space-y-4 rounded-2xl border bg-white p-5">
        <h2 className="text-xl font-bold">1. Add artwork</h2>
        <label className="block text-sm font-bold">Printable preview image — required
          <input key={`image-${inputKey}`} aria-label="Coloring page image" type="file" accept="image/png,image/jpeg,image/webp" onChange={event => chooseImage(event.target.files?.[0])} className="mt-2 block w-full rounded-lg border p-3" />
        </label>
        <p className="text-sm text-slate-500">PNG, JPG or WebP · max 20 MB. Print and lighter web copies are prepared automatically, preserving the whole drawing.</p>
        {preview && <img src={preview} alt="Selected artwork preview" className="max-h-64 max-w-full rounded-xl border object-contain" />}
        <label className="block text-sm font-bold">Vector SVG — optional, for online coloring and vector download
          <input ref={svgInput} key={`svg-${inputKey}`} aria-label="Coloring SVG file" type="file" accept=".svg,image/svg+xml" onChange={event => void chooseSvg(event.target.files?.[0])} className="mt-2 block w-full rounded-lg border p-3" />
        </label>
        <p className="text-sm text-slate-500">Upload the same drawing with clean black outlines and closed shapes. A PNG/JPG renamed to .svg is not a vector file. Max 2 MB.</p>
        {svgFile && <div className="flex flex-wrap items-center gap-3 rounded-xl bg-violet-50 p-3 text-sm"><span>✓ {svgFile.name} — Color Online and Download SVG enabled</span><button type="button" className="font-bold text-violet-700 underline" onClick={() => { setSvgFile(null); setAssetError(""); uploaded.current.svg = undefined; if (svgInput.current) svgInput.current.value = ""; }}>Remove SVG</button></div>}
        {assetError && <p role="alert" className="text-sm text-red-700">{assetError}</p>}
      </section>
      <section className="space-y-4 rounded-2xl border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">2. Generate SEO JSON</h2><button type="button" onClick={() => void copyPrompt()} className="rounded-xl bg-violet-100 px-4 py-3 font-bold text-violet-900">Copy Master Prompt</button></div>
        <p className="text-sm leading-6 text-slate-600">Send your preview image and this prompt to ChatGPT, Gemini, or Claude. The prompt includes the features available for your selected files. Review the result for accuracy before publishing.</p>
        <details><summary className="cursor-pointer text-sm font-bold text-violet-700">Read or copy the complete prompt</summary><textarea readOnly aria-label="Complete SEO master prompt" value={buildStudioPrompt(Boolean(svgFile))} rows={12} className="mt-3 w-full rounded-xl border p-3 font-mono text-xs" /></details>
      </section>
      <section className="space-y-4 rounded-2xl border bg-white p-5">
        <h2 className="text-xl font-bold">3. Upload or paste SEO JSON</h2>
        <input key={`json-${inputKey}`} aria-label="SEO JSON file" type="file" accept=".json,application/json" onChange={event => void chooseJson(event.target.files?.[0])} className="block w-full rounded-lg border p-3" />
        <textarea aria-label="SEO JSON text" rows={10} spellCheck={false} value={json} onChange={event => { setJson(event.target.value); setMessage(""); }} placeholder="Paste one complete JSON object here…" className="w-full rounded-xl border p-3 font-mono text-xs" />
        {parseError && <p role="alert" className="text-sm text-red-700">{parseError}</p>}
        {issues.length > 0 && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-900"><strong>Fix these fields before saving:</strong><ul className="mt-2 list-disc space-y-1 pl-5">{issues.map((issue, index) => <li key={index}>{issue}</li>)}</ul></div>}
      </section>
      {seo && <section className="space-y-4 rounded-2xl border bg-white p-5">
        <h2 className="text-xl font-bold">4. Validation and preview</h2>
        <p className="text-sm text-slate-500">These ranges are site editorial rules, not a Google score or a ranking guarantee. Cards use the meta description; a separate cardDescription is not needed.</p>
        <div className="grid gap-2 sm:grid-cols-2">{SEO_RULES.map(rule => { const count = fieldCount(seo[rule.key], rule.unit); const ok = count >= rule.min && count <= rule.max; return <div key={rule.key} className={`rounded-xl border p-3 text-sm ${ok ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}><strong>{ok ? "✓" : "✕"} {rule.label}</strong><p>{count} / {rule.min}–{rule.max} {rule.unit}</p></div>; })}</div>
        <div className="rounded-xl border p-4"><p className="text-xs font-bold uppercase text-slate-500">Search preview</p><p className="mt-2 text-lg text-blue-800">{seo.seoTitle}</p><p className="break-all text-xs text-green-800">/coloring-pages/{canonicalCategorySlug(seo.category)}/{seo.slug}/</p><p className="mt-1 text-sm text-slate-700">{seo.seoDescription}</p><hr className="my-4" /><h3 className="text-xl font-bold">{seo.title}</h3><p className="mt-1 text-sm text-slate-500">{seo.category} · {seo.ageRange} · {seo.difficulty}</p><p className="mt-4 whitespace-pre-line text-sm leading-7">{seo.description}</p><p className="mt-3 text-sm"><b>Alt:</b> {seo.altText}</p><div className="mt-4 space-y-3">{seo.faqs.map((faq, index) => <div key={index}><strong className="text-sm">{faq.question}</strong><p className="text-sm leading-6">{faq.answer}</p></div>)}</div></div>
      </section>}
      <div className="flex flex-wrap gap-3"><button type="button" disabled={!valid || busy} onClick={() => void submit(false)} className="rounded-xl bg-slate-800 px-6 py-3 font-bold text-white disabled:opacity-40">Save Draft</button><button type="button" disabled={!valid || busy} onClick={() => void submit(true)} className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white disabled:opacity-40">Publish Page</button></div>
    </fieldset>
    {message && <p role="status" className="rounded-xl bg-violet-50 p-4 text-sm font-medium text-violet-900">{message}</p>}
    {publishedUrl && <Link href={publishedUrl} className="inline-block font-bold text-violet-700 underline">View published page →</Link>}
    <section className="rounded-2xl border bg-white p-5"><h2 className="text-xl font-bold">Existing drafts ({drafts.length})</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{drafts.map(draft => <div key={draft.id} className="flex gap-3 rounded-xl border p-3">{draft.imageUrl && <img src={getColoringImageAssets(draft.imageUrl).thumbnailUrl} alt="" className="h-20 w-16 object-contain" />}<div><p className="text-sm font-bold">{draft.title}</p><Link href={`/admin/coloring-pages/${draft.id}/`} className="text-sm font-bold text-violet-700 underline">Review or edit draft</Link></div></div>)}</div></section>
  </main>;
}
