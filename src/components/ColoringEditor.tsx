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

  svg.style.setProperty("background", "#ffffff", "important");
  svg.style.setProperty("opacity", "1", "important");
  svg.removeAttribute("width");
  svg.removeAttribute("height");

  template.content.querySelectorAll<SVGElement>("*").forEach((element) => {
    element.style.setProperty("opacity", "1", "important");
    element.style.setProperty("fill-opacity", "1", "important");
    element.style.setProperty("stroke-opacity", "1", "important");

    if (element.matches("path, polygon, circle, ellipse, rect, line, polyline")) {
      element.setAttribute("fill", "#ffffff");
      element.setAttribute("stroke", "#111827");
      element.setAttribute("stroke-width", "3");
      element.setAttribute("stroke-linecap", "round");
      element.setAttribute("stroke-linejoin", "round");
      element.style.setProperty("fill", "#ffffff", "important");
      element.style.setProperty("stroke", "#111827", "important");
      element.style.setProperty("stroke-width", "3", "important");
      element.style.setProperty("stroke-linecap", "round", "important");
      element.style.setProperty("stroke-linejoin", "round", "important");
    }
  });

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
    return () => { cancelled = true; };
  }, [renderSvgToCanvas, restoreCanvasState, saveCanvasState, storageKey]);

  const pushHistory = useCallback(() => {
    const current = saveCanvasState();
    if (!current) return;
    setHistory((previous) => {
      const next = [...previous.slice(0, historyIndex + 1), current];
      setHistoryIndex(next.length - 1);
      return next;
    });
  }, [historyIndex, saveCanvasState]);

  const handleFill = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeTool !== "fill") return;
    event.preventDefault();
    const changed = floodFillCanvas(canvasRef.current!, event.clientX, event.clientY, selectedColor);
    if (changed) pushHistory();
  };

  const getCanvasCoordinates = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeTool === "fill") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    event.preventDefault();
    canvas.setPointerCapture?.(event.pointerId);
    const { x, y } = getCanvasCoordinates(event);
    setIsDrawing(true);

    ctx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
    ctx.fillStyle = activeTool === "eraser" ? "#000000" : selectedColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool === "fill") return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    event.preventDefault();
    const { x, y } = getCanvasCoordinates(event);
    ctx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = (event?: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (event) {
      try { event.currentTarget.releasePointerCapture?.(event.pointerId); } catch {}
    }
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.globalCompositeOperation = "source-over";
    setIsDrawing(false);
    pushHistory();
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    void restoreCanvasState(history[nextIndex]);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    restoreCanvasState(history[nextIndex]);
  };

  const handleReset = async () => {
    try { localStorage.removeItem(storageKey); } catch {}
    await renderSvgToCanvas();
    const current = saveCanvasState();
    setHistory([current]);
    setHistoryIndex(0);
  };

  const handleSaveLocal = () => {
    const current = saveCanvasState();
    if (!current) return;
    try { localStorage.setItem(storageKey, current); } catch {}
    setSavedSuccess(true);
    window.setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${slug}-colored.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handlePrint = () => window.print();
  const changeZoom = (amount: number) =>
    setZoomLevel((value) => Math.min(2, Math.max(0.5, value + amount)));

  return (
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 text-white flex flex-col gap-6 max-w-5xl mx-auto my-4">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/60">
          {(["fill", "brush", "eraser"] as Tool[]).map((tool) => {
            const Icon = tool === "fill" ? PaintBucket : tool === "brush" ? Brush : Eraser;
            return (
              <button key={tool} onClick={() => setActiveTool(tool)} className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm ${activeTool === tool ? "bg-indigo-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tool === "fill" ? "Fill Bucket" : tool === "brush" ? "Brush" : "Eraser"}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40" title="Undo"><Undo2 className="w-4 h-4" /></button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40" title="Redo"><Redo2 className="w-4 h-4" /></button>
          <button onClick={() => changeZoom(-0.1)} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700" title="Zoom out"><ZoomOut className="w-4 h-4" /></button>
          <span className="text-xs font-semibold min-w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
          <button onClick={() => changeZoom(0.1)} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700" title="Zoom in"><ZoomIn className="w-4 h-4" /></button>
          <button onClick={handleReset} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700" title="Reset"><RotateCcw className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/70 p-3 rounded-2xl border border-slate-700">
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((color) => (
            <button key={color} type="button" onClick={() => setSelectedColor(color)} aria-label={`Select ${color}`} className={`w-7 h-7 rounded-full border-2 ${selectedColor === color ? "border-white scale-110" : "border-slate-600"}`} style={{ backgroundColor: color }} />
          ))}
          <label className="flex items-center gap-2 text-xs text-slate-300 ml-2">
            Custom
            <input type="color" value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent" />
          </label>
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          Brush
          <input type="range" min="4" max="40" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} />
          <span className="w-8 text-right">{brushSize}</span>
        </label>
      </div>

      <div className="relative rounded-2xl bg-white overflow-auto min-h-[420px] flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-3xl"
          style={{ aspectRatio: String(aspectRatio), transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full touch-none block"
            style={{ cursor: activeTool === "fill" ? "crosshair" : activeTool === "brush" ? "crosshair" : "cell" }}
            onPointerDown={activeTool === "fill" ? handleFill : startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
            aria-label={`Coloring area for ${title}`}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={handleSaveLocal} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm">
          {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {savedSuccess ? "Saved" : "Save"}
        </button>
        <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-semibold text-sm"><Download className="w-4 h-4" />Download PNG</button>
        <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-semibold text-sm"><Printer className="w-4 h-4" />Print</button>
        <button onClick={handleReset} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-semibold text-sm"><Sparkles className="w-4 h-4" />Start Over</button>
        <button onClick={() => document.documentElement.requestFullscreen?.()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-semibold text-sm"><Maximize2 className="w-4 h-4" />Fullscreen</button>
      </div>
    </div>
  );
}
