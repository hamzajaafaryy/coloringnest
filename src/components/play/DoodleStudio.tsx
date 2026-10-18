"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Brush, CheckCircle2, Download, Eraser, RotateCcw, Sparkles, Stamp, Trash2, Undo2 } from "lucide-react";

type Point = { x: number; y: number };
type Stroke = { kind: "line" | "stamp"; points: Point[]; color: string; size: number; stamp?: string };
type Tool = "brush" | "eraser" | "stamp";
const WIDTH = 900;
const HEIGHT = 540;
const PAPER = "#ffffff";
const STORAGE = "craftcoloring_doodle_studio_v1";
const COLORS = ["#1e293b", "#ef4444", "#f97316", "#facc15", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899", "#8b5e3c"];
const STICKERS = ["⭐", "🌈", "🦋", "❤️", "🌼", "🦄", "🐱", "🚀", "🎈", "✨"];

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  if (stroke.kind === "stamp") {
    const point = stroke.points[0];
    if (!point) return;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${stroke.size * 2.7}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.fillText(stroke.stamp || "⭐", point.x, point.y);
    ctx.restore();
    return;
  }
  const first = stroke.points[0];
  if (!first) return;
  ctx.save();
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(first.x, first.y);
  if (stroke.points.length === 1) {
    ctx.arc(first.x, first.y, stroke.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    for (const point of stroke.points.slice(1)) ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }
  ctx.restore();
}

export default function DoodleStudio({ onAward }: { onAward: (amount: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRef = useRef<Stroke | null>(null);
  const earnedRef = useRef(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState("#a855f7");
  const [size, setSize] = useState(13);
  const [sticker, setSticker] = useState("⭐");
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  const repaint = useCallback((items: Stroke[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    for (const stroke of items) drawStroke(ctx, stroke);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || "[]");
      if (Array.isArray(saved)) {
        const clean: Stroke[] = saved.filter((value: unknown): value is Stroke => {
          if (typeof value !== "object" || !value) return false;
          const v = value as Partial<Stroke>;
          return (v.kind === "line" || v.kind === "stamp") &&
            Array.isArray(v.points) && v.points.length <= 3000 &&
            v.points.every((p) => typeof p.x === "number" && typeof p.y === "number" && Number.isFinite(p.x) && Number.isFinite(p.y)) &&
            typeof v.color === "string" && typeof v.size === "number" && Number.isFinite(v.size);
        }).slice(-160);
        setStrokes(clean);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => { repaint(strokes); }, [strokes, repaint]);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE, JSON.stringify(strokes)); } catch {
      setNotice("Browser storage is full. You can still download your art!");
    }
  }, [strokes, ready]);

  function pointFromEvent(event: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(WIDTH, Math.max(0, (event.clientX - rect.left) * WIDTH / rect.width)),
      y: Math.min(HEIGHT, Math.max(0, (event.clientY - rect.top) * HEIGHT / rect.height)),
    };
  }

  function onDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    const point = pointFromEvent(event);
    earnedRef.current = false;
    setNotice("");
    if (tool === "stamp") {
      setStrokes((list) => [...list, { kind: "stamp", points: [point], color, size: 25, stamp: sticker }].slice(-160));
      return;
    }
    currentRef.current = { kind: "line", points: [point], color: tool === "eraser" ? PAPER : color, size: tool === "eraser" ? size * 2.4 : size };
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch {}
    repaint([...strokes, currentRef.current]);
  }

  function onMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!currentRef.current) return;
    event.preventDefault();
    const point = pointFromEvent(event);
    const last = currentRef.current.points[currentRef.current.points.length - 1];
    if (Math.abs(point.x - last.x) + Math.abs(point.y - last.y) < 1.8) return;
    if (currentRef.current.points.length < 3000) currentRef.current.points.push(point);
    repaint([...strokes, currentRef.current]);
  }

  function onUp(event: React.PointerEvent<HTMLCanvasElement>) {
    const current = currentRef.current;
    if (!current) return;
    event.preventDefault();
    currentRef.current = null;
    setStrokes((list) => [...list, current].slice(-160));
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {}
  }

  function undo() {
    if (!strokes.length) return;
    setStrokes((items) => items.slice(0, -1));
    earnedRef.current = false;
    setNotice("Last mark removed.");
  }

  function clear() {
    if (!strokes.length || !window.confirm("Start a fresh drawing? Your current artwork will be cleared.")) return;
    setStrokes([]);
    earnedRef.current = false;
    setNotice("A clean canvas! Time to create something new.");
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return;
    repaint(strokes);
    try {
      const anchor = document.createElement("a");
      anchor.href = canvas.toDataURL("image/png");
      anchor.download = "my-craftcoloring-masterpiece.png";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      if (!earnedRef.current) {
        earnedRef.current = true;
        onAward(5);
        setNotice("Masterpiece saved! You earned five artist stars! 🌟");
      } else setNotice("Your masterpiece is ready to keep!");
    } catch {
      setNotice("Couldn't save the picture. Try a different browser.");
    }
  }

  const tools: { id: Tool; label: string; icon: typeof Brush }[] = [
    { id: "brush", label: "Draw", icon: Brush },
    { id: "eraser", label: "Erase", icon: Eraser },
    { id: "stamp", label: "Stickers", icon: Stamp },
  ];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-widest text-emerald-600">Game 03 · Create freely</p><h3 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">My Doodle Studio 🖍️</h3><p className="mt-2 text-sm text-slate-600">Draw, erase, add cute stickers and save your very own picture.</p></div>
        <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-800"><CheckCircle2 className="mr-1 inline h-4 w-4" /> Saved on this device</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <div className="space-y-5 rounded-[1.7rem] bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 p-4">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-600">Your tools</p>
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
              {tools.map(item => {
                const Icon = item.icon;
                return <button key={item.id} type="button" aria-pressed={tool === item.id}
                  onClick={() => setTool(item.id)}
                  className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 px-2 py-3 text-sm font-black transition lg:justify-start ${tool === item.id ? "border-violet-500 bg-violet-600 text-white shadow-md" : "border-white bg-white text-slate-700 hover:border-violet-300"}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" /> {item.label}
                </button>;
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-600">Pick a color</p>
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map(c => <button key={c} type="button" title={c} aria-label={`Select color ${c}`} aria-pressed={tool !== "eraser" && color === c}
                onClick={() => { setColor(c); setTool("brush"); }}
                className={`aspect-square rounded-full border-4 border-white shadow-sm transition hover:scale-110 ${color === c && tool === "brush" ? "ring-2 ring-violet-600 ring-offset-2" : ""}`}
                style={{ backgroundColor: c }} />)}
            </div>
          </div>

          {tool === "stamp" && <div>
            <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-600">Choose a sticker</p>
            <div className="grid grid-cols-5 gap-1">
              {STICKERS.map(icon => <button type="button" key={icon} aria-label={`Sticker ${icon}`} aria-pressed={sticker === icon}
                onClick={() => setSticker(icon)}
                className={`flex aspect-square items-center justify-center rounded-xl text-2xl transition hover:scale-110 ${sticker === icon ? "bg-white ring-2 ring-violet-500" : "bg-white/50"}`}>{icon}</button>)}
            </div>
          </div>}

          {tool !== "stamp" && <label className="block text-xs font-black text-slate-600">
            Brush size <span className="text-violet-600">{size}</span>
            <input type="range" aria-label="Brush size" min={4} max={35} step={1} value={size} onChange={e => setSize(Number(e.target.value))}
              className="mt-3 w-full accent-violet-600" />
          </label>}
        </div>

        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-[1.6rem] border-[7px] border-violet-100 bg-white shadow-inner sm:border-[10px]">
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
              aria-label="Interactive doodle canvas: choose a tool, then drag to paint, or tap to add stickers."
              className="block aspect-[5/3] w-full cursor-crosshair bg-white"
              style={{ touchAction: "none" }} />
          </div>
          <div role="status" aria-live="polite" className="mt-3 min-h-6 text-sm font-bold text-emerald-700">{notice || "✨ Tip: try the rainbow colors and the magical stickers!"}</div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={undo} disabled={!strokes.length} className="cc-btn cc-btn-outline disabled:opacity-40"><Undo2 className="h-4 w-4" /> Undo</button>
            <button type="button" onClick={clear} disabled={!strokes.length} className="cc-btn cc-btn-outline disabled:opacity-40"><Trash2 className="h-4 w-4" /> Clear</button>
            <button type="button" onClick={download} disabled={!strokes.length} className="cc-btn cc-btn-primary flex-1 text-base disabled:opacity-40 sm:flex-none"><Download className="h-5 w-5" /> Save PNG +5 ⭐</button>
          </div>
        </div>
      </div>
    </div>
  );
}
