"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PaintBucket,
  Brush,
  Eraser,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Save,
  Check,
  Sparkles,
} from "lucide-react";

interface ColoringEditorProps {
  slug: string;
  title: string;
  svgContent: string;
}

const PRESET_COLORS = [
  "#111827", "#FFFFFF", "#EF4444", "#F97316", "#EAB308", "#10B981",
  "#06B6D4", "#3B82F6", "#8B5CF6", "#EC4899", "#8D4925", "#6B7280",
];

type Tool = "fill" | "brush" | "eraser";

function prepareColoringSvg(svgContent: string) {
  const template = document.createElement("template");
  template.innerHTML = svgContent.trim();
  const svg = template.content.querySelector("svg");
  if (!svg) return svgContent;

  // IMPORTANT: preserve the source SVG exactly.
  // The artwork shown on the site must match the uploaded SVG 1:1.
  // Do not rewrite path fills, strokes, widths, opacity, <use>, <defs>, etc.
  // Those changes alter the artwork and make the online version different
  // from the original SVG.
  svg.style.setProperty("background", "#ffffff", "important");
  svg.removeAttribute("width");
  svg.removeAttribute("height");

  return svg.outerHTML;
}
function getSvgVersion(svg: string) {
  let hash = 2166136261;
  for (let i = 0; i < svg.length; i += 1) {
    hash ^= svg.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function getSvgAspectRatio(svgContent: string) {
  const template = document.createElement("template");
  template.innerHTML = svgContent.trim();
  const svg = template.content.querySelector("svg");
  if (!svg) return 4 / 3;

  const viewBox = svg.getAttribute("viewBox")?.trim().split(/\s+/).map(Number);
  if (viewBox && viewBox.length === 4 && viewBox[2] > 0 && viewBox[3] > 0) {
    return viewBox[2] / viewBox[3];
  }

  const width = parseFloat(svg.getAttribute("width") || "");
  const height = parseFloat(svg.getAttribute("height") || "");
  if (width > 0 && height > 0) return width / height;

  return 4 / 3;
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = clean.length === 3
    ? clean.split("").map((char) => char + char).join("")
    : clean;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function isLinePixel(data: Uint8ClampedArray, index: number) {
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  const grayscale = Math.max(r, g, b) - Math.min(r, g, b);
  return luminance < 245 && grayscale < 28;
}

function floodFillCanvas(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
  color: string
) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;

  const x = Math.floor(((clientX - rect.left) / rect.width) * canvas.width);
  const y = Math.floor(((clientY - rect.top) / rect.height) * canvas.height);
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return false;

  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  const seedIndex = (y * canvas.width + x) * 4;

  if (isLinePixel(data, seedIndex)) return false;

  const target = {
    r: data[seedIndex],
    g: data[seedIndex + 1],
    b: data[seedIndex + 2],
    a: data[seedIndex + 3],
  };
  const fill = hexToRgb(color);

  const tolerance = 22;
  const matchesTarget = (index: number) => {
    if (data[index + 3] < 20) return false;
    if (isLinePixel(data, index)) return false;

    return (
      Math.abs(data[index] - target.r) <= tolerance &&
      Math.abs(data[index + 1] - target.g) <= tolerance &&
      Math.abs(data[index + 2] - target.b) <= tolerance
    );
  };

  const seedIsHugeWhiteBackground =
    target.r > 245 && target.g > 245 && target.b > 245;

  const stack = [[x, y]];
  const visited = new Uint8Array(canvas.width * canvas.height);
  visited[y * canvas.width + x] = 1;
  let changed = 0;

  while (stack.length) {
    const point = stack.pop();
    if (!point) break;
    const [px, py] = point;
    const index = (py * canvas.width + px) * 4;

    if (!matchesTarget(index)) continue;

    data[index] = fill.r;
    data[index + 1] = fill.g;
    data[index + 2] = fill.b;
    data[index + 3] = 255;
    changed += 1;

    if (px > 0) {
      const i = py * canvas.width + px - 1;
      if (!visited[i]) { visited[i] = 1; stack.push([px - 1, py]); }
    }
    if (px < canvas.width - 1) {
      const i = py * canvas.width + px + 1;
      if (!visited[i]) { visited[i] = 1; stack.push([px + 1, py]); }
    }
    if (py > 0) {
      const i = (py - 1) * canvas.width + px;
      if (!visited[i]) { visited[i] = 1; stack.push([px, py - 1]); }
    }
    if (py < canvas.height - 1) {
      const i = (py + 1) * canvas.width + px;
      if (!visited[i]) { visited[i] = 1; stack.push([px, py + 1]); }
    }
  }

  // Never allow a click on the page's huge outer white background to paint
  // the entire canvas accidentally.
  if (seedIsHugeWhiteBackground && changed > canvas.width * canvas.height * 0.55) {
    return false;
  }

  if (!changed) return false;
  ctx.putImageData(image, 0, 0);
  return true;
}

export default function ColoringEditor({ slug, title, svgContent }: ColoringEditorProps) {
  const [selectedColor, setSelectedColor] = useState("#EC4899");
  const [activeTool, setActiveTool] = useState<Tool>("fill");
  const [brushSize, setBrushSize] = useState(12);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aspectRatio = useMemo(() => getSvgAspectRatio(svgContent), [svgContent]);
  const preparedSvgContent = useMemo(() => prepareColoringSvg(svgContent), [svgContent]);
  const svgVersion = useMemo(() => getSvgVersion(preparedSvgContent), [preparedSvgContent]);
  const storageKey = useMemo(() => `craftcoloring_canvas_${slug}_${svgVersion}`, [slug, svgVersion]);

  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    return canvas.toDataURL("image/png");
  }, []);

  const restoreCanvasState = useCallback((dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas || !dataUrl) return Promise.resolve(false);

    return new Promise<boolean>((resolve) => {
      const image = new Image();
      image.onload = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(false);
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(true);
      };
      image.onerror = () => resolve(false);
      image.src = dataUrl;
    });
  }, []);

  const renderSvgToCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = 1600;
    const height = Math.max(900, Math.round(width / aspectRatio));
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const blob = new Blob([preparedSvgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    try {
      const image = new Image();
      image.decoding = "async";
      image.src = url;
      await image.decode();

      const scale = Math.min(width / image.width, height / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const offsetX = (width - drawWidth) / 2;
      const offsetY = (height - drawHeight) / 2;

      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    } finally {
      URL.revokeObjectURL(url);
    }
  }, [aspectRatio, preparedSvgContent]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      await renderSvgToCanvas();
      if (cancelled) return;

      let saved = "";
      try {
        saved = localStorage.getItem(storageKey) || "";
      } catch {}

      if (saved) await restoreCanvasState(saved);

      if (cancelled) return;
      const current = saveCanvasState();
      setHistory([current]);
      setHistoryIndex(0);
    };

    init();
    return (
    <div className="mx-auto my-4 flex max-w-5xl flex-col gap-4 rounded-[2rem] border border-violet-100 bg-gradient-to-b from-violet-50 via-white to-sky-50 p-3 text-slate-900 shadow-2xl shadow-violet-100 sm:gap-5 sm:p-5">
      <div className="flex flex-col gap-3 rounded-[1.5rem] bg-white p-3 shadow-sm ring-1 ring-violet-100 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-500">
              Coloring tools
            </p>
            <p className="mt-0.5 text-sm font-black text-slate-900">
              Pick a tool, then tap the picture
            </p>
          </div>
          <span className="hidden rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700 sm:inline-flex">
            Save your picture anytime
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(["fill", "brush", "eraser"] as Tool[]).map((tool) => {
            const Icon =
              tool === "fill" ? PaintBucket : tool === "brush" ? Brush : Eraser;
            const label =
              tool === "fill" ? "Fill" : tool === "brush" ? "Brush" : "Eraser";

            return (
              <button
                key={tool}
                type="button"
                onClick={() => setActiveTool(tool)}
                aria-pressed={activeTool === tool}
                className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 px-3 text-xs font-black transition active:scale-[.98] sm:text-sm ${activeTool === tool ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-100" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"}`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-white p-3 shadow-sm ring-1 ring-violet-100 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
            Pick a color
          </p>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black text-violet-700">
            {activeTool === "fill"
              ? "Tap an area to fill it"
              : activeTool === "brush"
                ? "Draw with your finger"
                : "Erase brush marks"}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-12">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              aria-label={`Select color ${color}`}
              aria-pressed={selectedColor === color}
              className={`aspect-square min-h-10 rounded-full border-[3px] shadow-sm transition active:scale-95 sm:min-h-11 ${selectedColor === color ? "scale-110 border-violet-600 ring-2 ring-violet-200" : "border-white ring-1 ring-slate-200"}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 text-xs font-black text-slate-600">
            Custom color
            <input
              type="color"
              value={selectedColor}
              onChange={(event) => setSelectedColor(event.target.value)}
              className="h-9 w-12 cursor-pointer rounded-lg bg-transparent"
              aria-label="Choose a custom color"
            />
          </label>

          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-3 text-xs font-black text-slate-600 sm:max-w-sm">
            Brush size
            <input
              type="range"
              min="4"
              max="40"
              value={brushSize}
              onChange={(event) => setBrushSize(Number(event.target.value))}
              className="min-w-0 flex-1 accent-violet-600"
              aria-label="Brush size"
            />
            <span className="w-7 text-right text-slate-900">{brushSize}</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto rounded-[1.5rem] bg-slate-950 p-2 text-white shadow-lg">
        <button
          type="button"
          onClick={handleUndo}
          disabled={historyIndex <= 0}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20 disabled:opacity-30"
          aria-label="Undo"
          title="Undo"
        >
          <Undo2 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20 disabled:opacity-30"
          aria-label="Redo"
          title="Redo"
        >
          <Redo2 className="h-5 w-5" />
        </button>

        <span className="mx-1 h-7 w-px shrink-0 bg-white/15" />

        <button
          type="button"
          onClick={() => changeZoom(-0.1)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <span className="min-w-12 shrink-0 text-center text-xs font-black">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          type="button"
          onClick={() => changeZoom(0.1)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        <span className="mx-1 h-7 w-px shrink-0 bg-white/15" />

        <button
          type="button"
          onClick={handleReset}
          className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 text-xs font-black transition hover:bg-white/20"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="relative flex min-h-[300px] items-center justify-center overflow-auto rounded-[1.75rem] border-4 border-white bg-white p-2 shadow-xl ring-1 ring-violet-100 sm:min-h-[500px] sm:p-4">
        <div
          className="relative w-full max-w-3xl"
          style={{
            aspectRatio: String(aspectRatio),
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center",
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 block h-full w-full touch-none rounded-xl"
            style={{
              cursor:
                activeTool === "fill"
                  ? "crosshair"
                  : activeTool === "brush"
                    ? "crosshair"
                    : "cell",
            }}
            onPointerDown={activeTool === "fill" ? handleFill : startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
            aria-label={`Interactive coloring area for ${title}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <button
          type="button"
          onClick={handleSaveLocal}
          className="cc-btn cc-btn-primary w-full px-3 text-xs sm:text-sm"
        >
          {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {savedSuccess ? "Saved!" : "Save"}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="cc-btn cc-btn-soft w-full px-3 text-xs sm:text-sm"
        >
          <Download className="h-4 w-4" />
          Download
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="cc-btn cc-btn-print w-full px-3 text-xs sm:text-sm"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="cc-btn cc-btn-outline w-full px-3 text-xs sm:text-sm"
        >
          <Sparkles className="h-4 w-4" />
          Start over
        </button>

        <button
          type="button"
          onClick={() => document.documentElement.requestFullscreen?.()}
          className="cc-btn cc-btn-dark col-span-2 w-full px-3 text-xs sm:col-span-1 sm:text-sm"
        >
          <Maximize2 className="h-4 w-4" />
          Fullscreen
        </button>
      </div>

      <p className="px-2 text-center text-[11px] font-bold leading-5 text-slate-500 sm:text-xs">
        Tip: on phones and tablets, use one finger to color. Save stores your picture on this device.
      </p>
    </div>
  );
}
