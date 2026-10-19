"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronRight, Download, Eraser, Heart, Paintbrush, RotateCcw, Save, Sparkles, Undo2, WandSparkles } from "lucide-react";
import CartoonCharacter, { CARTOONS, type CartoonId, type CartoonPaint } from "./CartoonCharacters";

type Progress = Record<CartoonId, CartoonPaint>;
type Hist = CartoonPaint[];
const STORE = "craftcoloring_storybook_coloring_v2";
const WINS_STORE = "craftcoloring_cartoon_wins_v1";
const EMPTY: Progress = { kitty: {}, unicorn: {}, dino: {}, bunny: {} };

const PALETTE = [
  { name: "Strawberry", hex: "#ff7196" },
  { name: "Peach", hex: "#ffab86" },
  { name: "Sunshine", hex: "#ffcc59" },
  { name: "Lemon", hex: "#ffeb86" },
  { name: "Mint", hex: "#76ddb5" },
  { name: "Forest", hex: "#3fbf95" },
  { name: "Sky", hex: "#7ac9ff" },
  { name: "Ocean", hex: "#589fe9" },
  { name: "Lavender", hex: "#b3a2fa" },
  { name: "Purple", hex: "#8d76da" },
  { name: "Bubblegum", hex: "#f3a6d6" },
  { name: "Cream", hex: "#fff4db" },
  { name: "Cocoa", hex: "#be9778" },
  { name: "Rose", hex: "#df6089" },
  { name: "Snow", hex: "#ffffff" },
  { name: "Ink", hex: "#444663" },
];

const PRESETS: Record<CartoonId, string[]> = {
  kitty: ["#ffcc59", "#fff4db", "#ff7196", "#7ac9ff", "#f3a6d6", "#ffab86"],
  unicorn: ["#fff4db", "#f3a6d6", "#b3a2fa", "#7ac9ff", "#ffcc59", "#76ddb5"],
  dino: ["#76ddb5", "#ffcc59", "#3fbf95", "#ffab86", "#7ac9ff", "#b3a2fa"],
  bunny: ["#fff4db", "#ff7196", "#b3a2fa", "#ffab86", "#76ddb5", "#ffcc59"],
};

function isColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

function safeProgress(value: unknown): Progress {
  const result: Progress = { kitty: {}, unicorn: {}, dino: {}, bunny: {} };
  if (!value || typeof value !== "object" || Array.isArray(value)) return result;
  for (const scene of CARTOONS) {
    const stored = (value as Record<string, unknown>)[scene.id];
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) continue;
    for (const region of scene.pieces) {
      const selected = (stored as Record<string, unknown>)[region];
      if (isColor(selected)) result[scene.id][region] = selected;
    }
  }
  return result;
}

export default function CartoonColoring({
  onAward,
  onFeedback,
}: {
  onAward: (amount: number) => void;
  onFeedback?: (success: boolean) => void;
}) {
  const [active, setActive] = useState<CartoonId>("kitty");
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [selected, setSelected] = useState(PALETTE[0].hex);
  const [undo, setUndo] = useState<Hist>([]);
  const [redo, setRedo] = useState<Hist>([]);
  const [completeIds, setCompleteIds] = useState<CartoonId[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("Choose a paint color, then tap any part of the picture.");
  const [saving, setSaving] = useState(false);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const scene = CARTOONS.find(item => item.id === active)!;
  const artwork = progress[active];
  const painted = scene.pieces.filter(part => isColor(artwork[part])).length;
  const complete = painted === scene.pieces.length;

  useEffect(() => {
    try {
      setProgress(safeProgress(JSON.parse(localStorage.getItem(STORE) || "{}")));
      const savedWins = JSON.parse(localStorage.getItem(WINS_STORE) || "[]");
      if (Array.isArray(savedWins)) {
        setCompleteIds(savedWins.filter((id): id is CartoonId => CARTOONS.some(scene => scene.id === id)));
      }
    } catch { /* Private mode still allows playing without persistence. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORE, JSON.stringify(progress)); } catch {}
  }, [progress, ready]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(WINS_STORE, JSON.stringify(completeIds)); } catch {}
  }, [completeIds, ready]);

  const paintPart = useCallback((id: string) => {
    if (!scene.pieces.includes(id) || !ready) return;
    if (artwork[id] === selected) return;

    const updated = { ...artwork, [id]: selected };
    setUndo(stack => [...stack.slice(-29), artwork]);
    setRedo([]);
    setProgress(previous => ({ ...previous, [active]: updated }));

    const finishedNow = scene.pieces.every(part => isColor(updated[part]));
    if (finishedNow && !completeIds.includes(active)) {
      setCompleteIds(previous => [...previous, active]);
      setNotice(`🎉 Fantastic! You finished ${scene.name} and earned 15 stars!`);
      onAward(15);
    } else {
      setNotice(`Beautiful color! ${scene.pieces.length - Object.keys(updated).length} shapes still waiting.`);
      onFeedback?.(true);
    }
  }, [scene, ready, artwork, selected, active, completeIds, onAward, onFeedback]);

  function selectScene(id: CartoonId) {
    setActive(id);
    setUndo([]);
    setRedo([]);
    setSelected(PRESETS[id][0]);
    setNotice("Choose your favorite paint color and tap a shape to get started.");
    onFeedback?.(true);
  }

  function undoLast() {
    if (!undo.length) return;
    const last = undo[undo.length - 1];
    setUndo(stack => stack.slice(0, -1));
    setRedo(stack => [...stack.slice(-29), artwork]);
    setProgress(previous => ({ ...previous, [active]: last }));
    setNotice("One step back. Keep exploring!");
    onFeedback?.(true);
  }

  function redoLast() {
    if (!redo.length) return;
    const next = redo[redo.length - 1];
    setRedo(stack => stack.slice(0, -1));
    setUndo(stack => [...stack.slice(-29), artwork]);
    setProgress(previous => ({ ...previous, [active]: next }));
    setNotice("Your color is back!");
    onFeedback?.(true);
  }

  function startOver() {
    if (!window.confirm(`Start ${scene.name} again? This clears its colors on this device.`)) return;
    setUndo(stack => [...stack.slice(-29), artwork]);
    setRedo([]);
    setProgress(previous => ({ ...previous, [active]: {} }));
    setNotice("A fresh page! Try a whole new color combination.");
  }

  function fillWithMagicPalette() {
    const next: CartoonPaint = {};
    scene.pieces.forEach((part, index) => {
      next[part] = PRESETS[active][index % PRESETS[active].length];
    });
    setUndo(stack => [...stack.slice(-29), artwork]);
    setRedo([]);
    setProgress(previous => ({ ...previous, [active]: next }));
    setNotice("✨ Magical colors appeared! Try recoloring any shape your way.");
    // Magic fills are a creative preview, not a prize; stars reward a child's own painting.
    onFeedback?.(true);
  }

  async function download() {
    const svg = svgContainerRef.current?.querySelector("svg");
    if (!svg || saving) return;
    setSaving(true);
    try {
      const clone = svg.cloneNode(true) as SVGSVGElement;
      clone.setAttribute("width", "1600");
      clone.setAttribute("height", "1200");
      // Rendering inline SVG to a high-resolution canvas creates a shareable PNG.
      const markup = new XMLSerializer().serializeToString(clone);
      const objectUrl = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }));
      const image = new Image();
      try {
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Could not render the illustration"));
          image.src = objectUrl;
        });
        const canvas = document.createElement("canvas");
        canvas.width = 1600;
        canvas.height = 1200;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, 1600, 1200);
        context.drawImage(image, 0, 0, 1600, 1200);
        const anchor = document.createElement("a");
        anchor.download = `craftcoloring-${active}-artwork.png`;
        anchor.href = canvas.toDataURL("image/png");
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setNotice("Your high-quality PNG is saved! Show off your artwork.");
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    } catch {
      setNotice("Couldn't save the image on this browser. Please try another device.");
    } finally {
      setSaving(false);
    }
  }

  const next = CARTOONS[(CARTOONS.findIndex(item => item.id === active) + 1) % CARTOONS.length];

  return (
    <div className="min-w-0 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[.15em] text-fuchsia-600">Storybook Coloring Studio · Adventure 01</p>
          <h3 className="mt-1 text-2xl font-black tracking-tight text-[#251b47] sm:text-4xl">Paint your cartoon friends</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Meet four hand-drawn storybook characters. Fill every piece, collect stars, and save your own colorful masterpiece.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-black text-amber-800">
          <Heart className="h-4 w-4 fill-pink-400 text-pink-500"/> {completeIds.length} of {CARTOONS.length} friends discovered
        </span>
      </header>

      <div role="group" aria-label="Choose your storybook character" className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {CARTOONS.map((item, index) => {
          const isActive = active === item.id;
          const finished = completeIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => selectScene(item.id)}
              className={`group min-w-0 overflow-hidden rounded-[1.4rem] border-2 p-2 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-violet-600 sm:p-3 ${isActive ? "border-violet-500 bg-violet-50 shadow-lg shadow-violet-100" : "border-slate-100 bg-white hover:border-violet-200"}`}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-violet-50 to-rose-50">
                <CartoonCharacter id={item.id} interactive={false} className="pointer-events-none h-full w-full"/>
              </div>
              <div className="mt-2 flex min-w-0 items-center justify-between gap-1">
                <span className="min-w-0 truncate text-xs font-black text-slate-900 sm:text-sm">{item.name}</span>
                {finished ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600"/> : <span className="shrink-0 text-[10px] font-bold text-slate-400">{index+1}/{CARTOONS.length}</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_285px] lg:gap-5">
        <div className="min-w-0 overflow-hidden rounded-[1.6rem] border-[5px] border-white bg-white shadow-[0_16px_48px_rgba(71,48,128,.13)] sm:rounded-[2.2rem] sm:border-[8px]">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-[#f4efff] to-[#fff4e8] px-3 py-3 sm:px-5">
            <div className="min-w-0"><p className="text-sm font-black text-violet-950">{scene.name}</p><p className="text-xs text-slate-600">{scene.subtitle}</p></div>
            <span className="rounded-xl bg-white/80 px-3 py-2 text-xs font-black text-violet-800">{painted}/{scene.pieces.length} colored</span>
          </div>
          <div ref={svgContainerRef} className="relative min-w-0 overflow-hidden [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_svg]:touch-manipulation">
            <CartoonCharacter id={active} paint={artwork} onPaint={paintPart} interactive className="h-auto w-full"/>
          </div>
          <div className="border-t border-violet-100 bg-white px-3 py-3 sm:px-5">
            <div className="mb-2 flex justify-between gap-2 text-xs font-black text-slate-600"><span>Coloring journey</span><span>{Math.round(100*painted/scene.pieces.length)}%</span></div>
            <div role="progressbar" aria-label="Storybook picture progress" aria-valuenow={painted} aria-valuemin={0} aria-valuemax={scene.pieces.length} className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-rose-400 via-yellow-400 to-emerald-400 transition-[width] duration-300" style={{width:`${100*painted/scene.pieces.length}%`}} />
            </div>
            {complete && <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-center text-sm font-black text-emerald-700">✨ Wonderful artwork! Try another color or save your picture.</p>}
          </div>
        </div>

        <aside className="min-w-0 space-y-4">
          <div className="rounded-[1.5rem] border border-purple-100 bg-gradient-to-b from-[#f4eaff] via-[#fff8fd] to-[#fff6e8] p-4 shadow-sm">
            <h4 className="flex items-center gap-2 text-base font-black text-slate-900"><Paintbrush className="h-5 w-5 text-violet-600"/> Your magical paintbox</h4>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">1. Pick a color. 2. Tap a body part in the picture.</p>
            <div role="group" aria-label="Choose a paint color" className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-8 lg:grid-cols-4">
              {PALETTE.map(shade => (
                <button key={shade.hex} type="button" aria-label={shade.name} title={shade.name} aria-pressed={selected===shade.hex}
                  onClick={()=>{setSelected(shade.hex);onFeedback?.(true);}}
                  className={`relative aspect-square min-h-11 min-w-0 rounded-2xl border-[3px] border-white shadow-md transition duration-150 active:scale-90 hover:scale-105 ${selected===shade.hex ? "ring-[3px] ring-violet-600 ring-offset-2" : ""}`}
                  style={{backgroundColor:shade.hex}}>
                  {selected===shade.hex&&<CheckCircle2 className={`absolute inset-0 m-auto h-5 w-5 ${shade.name==="Snow"||shade.name==="Cream"||shade.name==="Lemon"?"text-violet-700":"text-white"}`} aria-hidden="true"/>}
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-violet-100 bg-white/80 px-3 py-2 text-xs font-bold text-violet-800">
              Selected: <span className="font-black">{PALETTE.find(shade=>shade.hex===selected)?.name}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={undoLast} disabled={!undo.length} className="cc-btn cc-btn-outline min-w-0 text-xs disabled:opacity-40"><Undo2 className="h-4 w-4"/> Undo</button>
            <button type="button" onClick={redoLast} disabled={!redo.length} className="cc-btn cc-btn-outline min-w-0 text-xs disabled:opacity-40"><RotateCcw className="h-4 w-4 scale-x-[-1]"/> Redo</button>
            <button type="button" onClick={startOver} className="cc-btn cc-btn-outline min-w-0 text-xs"><Eraser className="h-4 w-4"/> Clear</button>
            <button type="button" onClick={fillWithMagicPalette} className="cc-btn min-w-0 border border-violet-200 bg-violet-100 px-2 text-xs font-black text-violet-800 hover:bg-violet-200"><WandSparkles className="h-4 w-4"/> Magic colors</button>
            <button type="button" onClick={download} disabled={saving} className="cc-btn cc-btn-primary col-span-2 w-full text-sm disabled:opacity-60"><Download className="h-5 w-5"/> {saving?"Saving image...":"Download your artwork"}</button>
          </div>
          <p role="status" aria-live="polite" className="min-h-14 rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm font-bold leading-6 text-violet-800">{notice}</p>
          <button type="button" onClick={()=>selectScene(next.id)} className="flex w-full min-h-12 items-center justify-between gap-2 rounded-xl bg-amber-100 px-4 py-3 text-left text-sm font-black text-amber-900 transition hover:bg-amber-200">
            Next cartoon: {next.name} <ChevronRight className="h-5 w-5 shrink-0"/>
          </button>
          <p className="flex items-start gap-2 text-xs leading-5 text-slate-500"><Save className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"/> Your coloring progress is automatically saved on this device.</p>
        </aside>
      </div>
    </div>
  );
}
