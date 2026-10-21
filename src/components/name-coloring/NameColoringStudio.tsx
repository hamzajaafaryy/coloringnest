"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { ArrowDown, Bug, Check, Download, Flower2, Footprints, Orbit, Palette, Printer, Sparkles } from "lucide-react";
import { buildNameSheet, MAX_NAME_LENGTH, NAME_THEMES, nameSheetDimensions, nameSheetFilename, validateColoringName, type NamePaper, type NameTheme } from "@/lib/name-coloring";
import { downloadBlob, downloadSvgPng } from "@/lib/coloring/download";

const ColoringEditor = dynamic(() => import("@/components/ColoringEditor"), {
  ssr: false,
  loading: () => <p role="status" className="rounded-2xl bg-white p-10 text-center text-sm text-[#6d5b7b]">Getting your colors ready…</p>,
});
const themeIcons = { butterflies: Bug, garden: Flower2, space: Orbit, dinosaurs: Footprints };

export default function NameColoringStudio() {
  const [name, setName] = useState("SARA");
  const [theme, setTheme] = useState<NameTheme>("butterflies");
  const [paper, setPaper] = useState<NamePaper>("letter");
  const [tracing, setTracing] = useState(false);
  const [mode, setMode] = useState<"preview" | "color">("preview");
  const [busy, setBusy] = useState<"png" | "svg" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const nameInput = useRef<HTMLInputElement>(null);
  const preview = useRef<HTMLElement>(null);
  const validation = validateColoringName(name);
  const valid = !validation.error;
  const previewName = valid ? validation.name : "SARA";
  const dimensions = nameSheetDimensions(paper);
  const svg = buildNameSheet({ name: previewName, theme, paper, tracing });
  const selectedTheme = NAME_THEMES.find(item => item.id === theme)!;

  function designChanged() {
    setMode("preview");
    setFeedback("");
    setDownloadError("");
  }

  function showPreview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid) { nameInput.current?.focus(); return; }
    setMode("preview");
    preview.current?.focus({ preventScroll: true });
    preview.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function download(format: "png" | "svg") {
    if (!valid || busy) return;
    setBusy(format);
    setFeedback("");
    setDownloadError("");
    const filename = nameSheetFilename(validation.name, theme);
    try {
      if (format === "svg") {
        downloadBlob(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }), `${filename}.svg`);
      } else {
        await downloadSvgPng(svg, dimensions.width, dimensions.height, `${filename}.png`);
      }
      setFeedback(`${format.toUpperCase()} ready. Your download has started.`);
    } catch {
      setDownloadError("We could not create the download. Please try again, or use Print Sheet.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div id="name-studio" className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-7">
      <form onSubmit={showPreview} className="min-w-0 space-y-6 rounded-[1.8rem] border border-[#e9dfee] bg-white p-5 shadow-[0_12px_40px_rgba(64,37,84,.04)] sm:p-6">
        <div>
          <div className="mb-4 flex items-center gap-2.5"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#efe4fb] text-xs font-black text-[#7642a8]">1</span><label htmlFor="coloring-name" className="font-extrabold text-[#3d2a52]">Start with a name</label></div>
          <input ref={nameInput} id="coloring-name" name="name" type="text" maxLength={36} autoComplete="off" autoCapitalize="words" spellCheck={false} value={name}
            onChange={event => { setName(event.target.value); designChanged(); }} placeholder="e.g. SARA" aria-invalid={!valid} aria-describedby={`coloring-name-help${valid ? "" : " coloring-name-error"}`}
            className={`min-h-14 w-full rounded-2xl border-2 bg-[#fdfaff] px-4 text-xl font-black tracking-wide text-[#43295c] outline-none transition placeholder:text-[#b4a3c3] focus:border-[#8b4ec9] ${valid ? "border-[#e6d7f1]" : "border-[#c54b68]"}`} />
          <div id="coloring-name-help" className="mt-2 flex items-start justify-between gap-2 text-xs leading-5 text-[#7c6b88]"><span>Capital bubble letters, ready to color.</span><span className="shrink-0 tabular-nums">{Array.from(name.normalize("NFC")).length}/{MAX_NAME_LENGTH}</span></div>
          {!valid && <p id="coloring-name-error" role="alert" className="mt-2 text-xs font-semibold leading-5 text-[#a52d4d]">{validation.error}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-xs text-[#7c6b88]">Try:</span>{["SARA", "HAMZA", "ÉLODIE"].map(example => <button key={example} type="button" onClick={() => { setName(example); designChanged(); }} className="min-h-9 rounded-full border border-[#e9dfef] px-3 text-[11px] font-bold text-[#73528e] transition hover:bg-[#f5edfb]">{example}</button>)}</div>
        </div>

        <fieldset>
          <legend className="mb-4 flex items-center gap-2.5 font-extrabold text-[#3d2a52]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffecd6] text-xs font-black text-[#8a5a25]">2</span>Pick a little world</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {NAME_THEMES.map(item => {
              const Icon = themeIcons[item.id];
              const selected = item.id === theme;
              return <button key={item.id} type="button" aria-label={`${item.short} theme`} aria-pressed={selected} onClick={() => { setTheme(item.id); designChanged(); }}
                className={`relative flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border-2 px-2 py-3 text-xs font-extrabold transition ${selected ? "border-[#8d51c3] bg-[#fbf6ff] text-[#63308f]" : "border-[#f0e8f3] bg-white text-[#73627f] hover:border-[#d6b9e9]"}`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-[.9rem]" style={{ background: item.surface, color: item.ink }}><Icon aria-hidden="true" className="h-6 w-6" /></span>{item.short}
                {selected && <Check aria-hidden="true" className="absolute right-2 top-2 h-3.5 w-3.5 text-[#7d42b3]" />}
              </button>;
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-[#eee6f2] pt-5">
          <legend className="sr-only">Print preferences</legend>
          <label htmlFor="name-paper" className="block text-xs font-extrabold text-[#63506f]">Paper size</label>
          <select id="name-paper" value={paper} onChange={event => { setPaper(event.target.value as NamePaper); designChanged(); }} className="min-h-11 w-full rounded-xl border border-[#e6d9ed] bg-[#fdfaff] px-3 text-sm font-semibold text-[#5d4670]">
            <option value="letter">US Letter · 8.5 × 11 in</option><option value="a4">A4 · 210 × 297 mm</option>
          </select>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#fcf7ee] p-3 text-sm leading-5 text-[#6c5260]"><input type="checkbox" checked={tracing} onChange={event => { setTracing(event.target.checked); designChanged(); }} className="mt-0.5 h-4 w-4 shrink-0 accent-[#8050b3]" /><span><strong className="block text-xs font-extrabold">Add a name tracing row</strong><span className="mt-1 block text-xs">A little extra letter practice.</span></span></label>
        </fieldset>
        <button type="submit" disabled={!valid} className="cc-btn min-h-12 w-full bg-[#7842b6] text-white shadow-[0_8px_20px_rgba(120,66,182,.16)] hover:bg-[#65349e] disabled:cursor-not-allowed disabled:opacity-50"><Sparkles aria-hidden="true" className="h-4 w-4" /> Preview My Page <ArrowDown aria-hidden="true" className="h-4 w-4" /></button>
        <p className="text-center text-xs leading-5 text-[#86758e]">The preview updates as you type.<br />Free to create. No account needed.</p>
      </form>

      <section ref={preview} tabIndex={-1} aria-labelledby="name-preview-heading" className="min-w-0 scroll-mt-28 rounded-[1.8rem] border border-[#e7dced] bg-[#f5effa] p-3 outline-none sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1 sm:mb-5">
          <div><h2 id="name-preview-heading" className="text-base font-black text-[#49305d]">Your coloring sheet</h2><p className="mt-1 text-xs text-[#7c688b]">{selectedTheme.label} <span aria-hidden="true">·</span> {paper === "a4" ? "A4" : "US Letter"}</p></div>
          <div role="group" aria-label="Preview or color your name" className="inline-flex rounded-full border border-[#e4d6ee] bg-white p-1 text-xs font-extrabold">
            <button id="name-preview-tab" type="button" aria-pressed={mode === "preview"} onClick={() => setMode("preview")} className={`min-h-10 rounded-full px-4 ${mode === "preview" ? "bg-[#ece0f7] text-[#673b90]" : "text-[#7e6b8e]"}`}>Preview</button>
            <button id="name-color-tab" type="button" aria-pressed={mode === "color"} disabled={!valid} onClick={() => { setMode("color"); setFeedback(""); }} className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 disabled:opacity-50 ${mode === "color" ? "bg-[#7441af] text-white" : "text-[#7441af]"}`}><Palette aria-hidden="true" className="h-3.5 w-3.5" /> Color Online</button>
          </div>
        </div>

        {mode === "preview" ? <div id="name-preview-panel" role="region" aria-labelledby="name-preview-tab">
          <div className="relative mx-auto max-w-[430px]">
            <div className="printable-artwork overflow-hidden rounded-lg bg-white shadow-[0_14px_35px_rgba(66,37,86,.12)] [&>svg]:block [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
            {!valid && <p className="absolute inset-x-5 bottom-6 rounded-xl border border-[#e7d7ed] bg-white/95 px-4 py-3 text-center text-xs font-bold text-[#79558e]">Example page. Add a valid name to make yours.</p>}
          </div>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            <button type="button" disabled={!valid} onClick={() => window.print()} className="cc-btn min-h-12 border border-[#edd7c2] bg-[#fff6e9] text-[#8b4b25] hover:bg-[#ffedda] disabled:opacity-50"><Printer aria-hidden="true" className="h-4 w-4 shrink-0" /> Print Sheet</button>
            <button type="button" disabled={!valid || busy !== null} aria-busy={busy === "png"} onClick={() => void download("png")} className="cc-btn min-h-12 bg-[#38254e] text-white hover:bg-[#563573] disabled:opacity-50"><Download aria-hidden="true" className="h-4 w-4 shrink-0" />{busy === "png" ? "Creating PNG…" : "Download PNG"}</button>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#84708f]"><span>Choose fit to page when printing.</span><button type="button" disabled={!valid || busy !== null} aria-busy={busy === "svg"} onClick={() => void download("svg")} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 font-extrabold text-[#714595] underline decoration-[#ccb4dc] underline-offset-4 disabled:opacity-50"><Download aria-hidden="true" className="h-3.5 w-3.5" />Download SVG</button></div>
        </div> : <div id="name-color-panel" role="region" aria-labelledby="name-color-tab"><p className="mb-3 px-1 text-xs leading-5 text-[#796187]">Pick a color, then tap inside a letter or decoration. Changing the name or theme starts a fresh page.</p><ColoringEditor slug={nameSheetFilename(validation.name, theme)} title={`${validation.name} name coloring page`} svgContent={svg} /></div>}
        {feedback && <p role="status" className="mt-3 rounded-xl border border-[#c8dfcf] bg-[#f1fbf3] px-4 py-3 text-sm text-[#386445]">{feedback}</p>}
        {downloadError && <p role="alert" className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{downloadError}</p>}
      </section>
    </div>
  );
}
