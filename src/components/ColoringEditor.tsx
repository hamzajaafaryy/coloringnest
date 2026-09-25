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
import { downloadSvgAsPng } from "@/lib/coloring/svgUtils";

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

  svg.style.backgroundColor = "#ffffff";
  svg.style.opacity = "1";

  template.content.querySelectorAll<SVGElement>("*").forEach((element) => {
    // Remove inherited transparency that can make line art look faded.
    element.style.opacity = "1";
    element.style.fillOpacity = "1";
    element.style.strokeOpacity = "1";

    if (element.matches("path, polygon, circle, ellipse, rect")) {
      const fill = (element.getAttribute("fill") || "").trim().toLowerCase();
      const stroke = (element.getAttribute("stroke") || "").trim().toLowerCase();

      // Every closed drawing region gets a solid white base so the bucket
      // tool has a real area to fill.
      if (!fill || fill === "none" || fill === "transparent") {
        element.setAttribute("fill", "#ffffff");
      } else {
        element.setAttribute("fill", "#ffffff");
      }

      if (!stroke || stroke === "none" || stroke === "transparent") {
        element.setAttribute("stroke", "#111827");
      } else {
        element.setAttribute("stroke", "#111827");
      }

      element.setAttribute("stroke-width", "2.25");
      element.setAttribute("stroke-linecap", "round");
      element.setAttribute("stroke-linejoin", "round");
      element.style.fill = "#ffffff";
      element.style.stroke = "#111827";
      element.style.strokeWidth = "2.25";
      element.style.pointerEvents = "auto";
      element.setAttribute("data-colorable", "true");
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

export default function ColoringEditor({ slug, title, svgContent }: ColoringEditorProps) {
  const [selectedColor, setSelectedColor] = useState("#EC4899");
  const [activeTool, setActiveTool] = useState<Tool>("fill");
  const [brushSize, setBrushSize] = useState(12);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // The source SVG version is part of the local-save key. When admin replaces
  // the artwork, the old saved drawing can no longer override the new source.
  const preparedSvgContent = useMemo(
    () => prepareColoringSvg(svgContent),
    [svgContent]
  );
  const svgVersion = useMemo(
    () => getSvgVersion(preparedSvgContent),
    [preparedSvgContent]
  );
  const storageKey = useMemo(
    () => `craftcoloring_saved_${slug}_${svgVersion}`,
    [slug, svgVersion]
  );

  const applySvgPresentation = useCallback(() => {
    const svg = svgWrapperRef.current?.querySelector("svg");
    if (!svg) return;
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.display = "block";
    svg.style.pointerEvents = "auto";
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }, []);

  useEffect(() => {
    if (!svgWrapperRef.current) return;

    let savedState = "";
    try {
      savedState = localStorage.getItem(storageKey) || "";
      // Remove the legacy unversioned key once, so an old SVG can never win.
      localStorage.removeItem(`craftcoloring_saved_${slug}`);
    } catch {}

    svgWrapperRef.current.innerHTML = savedState || preparedSvgContent;
    applySvgPresentation();

    setHistory([svgWrapperRef.current.innerHTML]);
    setHistoryIndex(0);
  }, [slug, preparedSvgContent, storageKey, applySvgPresentation]);

  const pushHistory = useCallback(() => {
    if (!svgWrapperRef.current) return;
    const currentSvg = svgWrapperRef.current.innerHTML;
    setHistory((previous) => {
      setHistoryIndex((previousIndex) => {
        const next = [...previous.slice(0, previousIndex + 1), currentSvg];
        return next.length - 1;
      });
      return [...previous.slice(0, historyIndex + 1), currentSvg];
    });
  }, [historyIndex]);

  const handleSvgClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== "fill") return;
    const target = event.target as Element | null;
    const colorable = target?.closest("path, polygon, circle, ellipse, rect");
    if (!colorable) return;
    const svgElement = colorable as SVGElement;
    svgElement.setAttribute("fill", selectedColor);
    svgElement.style.fill = selectedColor;
    svgElement.style.opacity = "1";
    svgElement.style.fillOpacity = "1";
    pushHistory();
  };

  const getCanvasCoordinates = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.max(window.devicePixelRatio || 1, 1);
      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);
      if (canvas.width === width && canvas.height === height) return;

      const oldCanvas = document.createElement("canvas");
      oldCanvas.width = canvas.width;
      oldCanvas.height = canvas.height;
      const oldCtx = oldCanvas.getContext("2d");
      if (oldCtx && canvas.width && canvas.height) oldCtx.drawImage(canvas, 0, 0);

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (oldCanvas.width && oldCanvas.height) {
        ctx.drawImage(oldCanvas, 0, 0, oldCanvas.width / dpr, oldCanvas.height / dpr);
      }
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);
    window.addEventListener("resize", resizeCanvas);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeTool === "fill") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    event.preventDefault();
    canvas.setPointerCapture?.(event.pointerId);
    const { x, y } = getCanvasCoordinates(event);
    setIsDrawing(true);
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = selectedColor;
    }
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
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = activeTool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = selectedColor;
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
    if (ctx) {
      ctx.closePath();
      ctx.globalCompositeOperation = "source-over";
    }
    setIsDrawing(false);
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    if (svgWrapperRef.current) svgWrapperRef.current.innerHTML = history[nextIndex];
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    if (svgWrapperRef.current) svgWrapperRef.current.innerHTML = history[nextIndex];
  };

  const handleReset = () => {
    if (svgWrapperRef.current) {
      svgWrapperRef.current.innerHTML = preparedSvgContent;
      applySvgPresentation();
      setHistory([svgWrapperRef.current.innerHTML]);
      setHistoryIndex(0);
    }
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    try { localStorage.removeItem(storageKey); } catch {}
  };

  const handleSaveLocal = () => {
    if (!svgWrapperRef.current) return;
    try { localStorage.setItem(storageKey, svgWrapperRef.current.innerHTML); } catch {}
    setSavedSuccess(true);
    window.setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDownload = async () => {
    if (!svgWrapperRef.current) return;
    await downloadSvgAsPng(svgWrapperRef.current, `${slug}-colored.png`);
  };

  const handlePrint = () => window.print();
  const changeZoom = (amount: number) => setZoomLevel((value) => Math.min(2, Math.max(0.5, value + amount)));

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
        <div className="relative w-full max-w-3xl aspect-[4/3]" style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}>
          <div ref={svgWrapperRef} onClick={handleSvgClick} className="absolute inset-0 z-10" aria-label={`Coloring area for ${title}`} />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-20 w-full h-full touch-none"
            style={{ pointerEvents: activeTool === "fill" ? "none" : "auto" }}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
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
