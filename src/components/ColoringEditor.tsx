"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  "#111827",
  "#FFFFFF",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#8D4925",
  "#6B7280",
];

type Tool = "fill" | "brush" | "eraser";

export default function ColoringEditor({
  slug,
  title,
  svgContent,
}: ColoringEditorProps) {
  const [selectedColor, setSelectedColor] = useState("#EC4899");
  const [activeTool, setActiveTool] = useState<Tool>("fill");
  const [brushSize, setBrushSize] = useState(12);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);

  /*
   * ============================================================
   * INITIALIZE SVG
   * ============================================================
   */

  useEffect(() => {
    if (!svgWrapperRef.current) return;

    const storageKey = `craftcoloring_saved_${slug}`;
    const savedState = localStorage.getItem(storageKey);

    svgWrapperRef.current.innerHTML = savedState || svgContent;

    const initialSvg = svgWrapperRef.current.innerHTML;

    setHistory([initialSvg]);
    setHistoryIndex(0);

    // Make SVG responsive
    const svg = svgWrapperRef.current.querySelector("svg");

    if (svg) {
      svg.style.width = "100%";
      svg.style.height = "100%";
      svg.style.display = "block";
      svg.style.pointerEvents = "auto";
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }
  }, [slug, svgContent]);

  /*
   * ============================================================
   * HISTORY
   * ============================================================
   */

  const pushHistory = useCallback(() => {
    if (!svgWrapperRef.current) return;

    const currentSvg = svgWrapperRef.current.innerHTML;

    setHistory((previousHistory) => {
      setHistoryIndex((previousIndex) => {
        const updatedHistory = previousHistory.slice(
          0,
          previousIndex + 1
        );

        updatedHistory.push(currentSvg);

        return updatedHistory.length - 1;
      });

      const currentIndex = historyIndex;

      return [
        ...previousHistory.slice(0, currentIndex + 1),
        currentSvg,
      ];
    });
  }, [historyIndex]);

  /*
   * ============================================================
   * FILL BUCKET
   * ============================================================
   */

  const handleSvgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== "fill") return;

    const target = e.target as Element | null;

    if (!target) return;

    const colorable = target.closest(
      "path, polygon, circle, ellipse, rect"
    );

    if (!colorable) return;

    // Never color the root SVG itself
    if (colorable.tagName.toLowerCase() === "svg") return;

    const element = colorable as SVGElement;

    element.setAttribute("fill", selectedColor);

    pushHistory();
  };

  /*
   * ============================================================
   * CANVAS RESOLUTION
   *
   * CSS size and internal canvas size are different.
   * We keep a high resolution internal canvas.
   * ============================================================
   */

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const dpr = Math.max(window.devicePixelRatio || 1, 1);

      const width = Math.round(rect.width * dpr);
      const height = Math.round(rect.height * dpr);

      if (canvas.width === width && canvas.height === height) {
        return;
      }

      /*
       * Preserve existing drawing when resizing.
       */
      const oldCanvas = document.createElement("canvas");
      oldCanvas.width = canvas.width;
      oldCanvas.height = canvas.height;

      const oldCtx = oldCanvas.getContext("2d");

      if (oldCtx && canvas.width > 0 && canvas.height > 0) {
        oldCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (oldCanvas.width > 0 && oldCanvas.height > 0) {
        ctx.drawImage(
          oldCanvas,
          0,
          0,
          oldCanvas.width / (window.devicePixelRatio || 1),
          oldCanvas.height / (window.devicePixelRatio || 1)
        );
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

  /*
   * ============================================================
   * GET EXACT CANVAS COORDINATES
   *
   * This is the important fix.
   *
   * client coordinates
   *       ↓
   * canvas bounding rect
   *       ↓
   * CSS pixels
   *       ↓
   * internal canvas coordinates
   * ============================================================
   */

  const getCanvasCoordinates = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width) * canvas.width;

    const y =
      ((event.clientY - rect.top) / rect.height) * canvas.height;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: x / scaleX,
      y: y / scaleY,
    };
  };

  /*
   * ============================================================
   * START DRAWING
   * ============================================================
   */

  const startDrawing = (
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (activeTool === "fill") return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    e.preventDefault();

    canvas.setPointerCapture?.(e.pointerId);

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    setIsDrawing(true);

    ctx.beginPath();
    ctx.moveTo(x, y);

    /*
     * Draw a dot immediately.
     * This makes single taps work.
     */
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
  };

  /*
   * ============================================================
   * DRAW
   * ============================================================
   */

  const draw = (
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || activeTool === "fill") return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    e.preventDefault();

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (activeTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = selectedColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  /*
   * ============================================================
   * STOP DRAWING
   * ============================================================
   */

  const stopDrawing = (
    e?: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    if (e) {
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {}
    }

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.closePath();
        ctx.globalCompositeOperation = "source-over";
      }
    }

    setIsDrawing(false);
  };

  /*
   * ============================================================
   * UNDO / REDO
   * ============================================================
   */

  const handleUndo = () => {
    if (historyIndex <= 0) return;

    const previousIndex = historyIndex - 1;

    setHistoryIndex(previousIndex);

    if (svgWrapperRef.current) {
      svgWrapperRef.current.innerHTML = history[previousIndex];
    }
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;

    const nextIndex = historyIndex + 1;

    setHistoryIndex(nextIndex);

    if (svgWrapperRef.current) {
      svgWrapperRef.current.innerHTML = history[nextIndex];
    }
  };

  /*
   * ============================================================
   * RESET
   * ============================================================
   */

  const handleReset = () => {
    if (svgWrapperRef.current) {
      svgWrapperRef.current.innerHTML = svgContent;

      const svg = svgWrapperRef.current.querySelector("svg");

      if (svg) {
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.display = "block";
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      }

      pushHistory();
    }

    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
    }

    localStorage.removeItem(`craftcoloring_saved_${slug}`);
  };

  /*
   * ============================================================
   * SAVE
   * ============================================================
   */

  const handleSaveLocal = () => {
    if (!svgWrapperRef.current) return;

    const key = `craftcoloring_saved_${slug}`;

    localStorage.setItem(
      key,
      svgWrapperRef.current.innerHTML
    );

    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  /*
   * ============================================================
   * DOWNLOAD
   * ============================================================
   */

  const handleDownload = async () => {
    if (!svgWrapperRef.current) return;

    const filename = `${slug}-colored.png`;

    await downloadSvgAsPng(
      svgWrapperRef.current,
      filename
    );
  };

  /*
   * ============================================================
   * PRINT
   * ============================================================
   */

  const handlePrint = () => {
    window.print();
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 text-white flex flex-col gap-6 max-w-5xl mx-auto my-4">

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">

        {/* Tools */}

        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/60">

          <button
            onClick={() => setActiveTool("fill")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
              activeTool === "fill"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <PaintBucket className="w-4 h-4" />

            <span className="hidden sm:inline">
              Fill Bucket
            </span>
          </button>

          <button
            onClick={() => setActiveTool("brush")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
              activeTool === "brush"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Brush className="w-4 h-4" />

            <span className="hidden sm:inline">
              Brush
            </span>
          </button>

          <button
            onClick={() => setActiveTool("eraser")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${
              activeTool === "eraser"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Eraser className="w-4 h-4" />

            <span className="hidden sm:inline">
              Eraser
            </span>
          </button>
        </div>

        {/* Undo / Redo / Zoom */}

        <div className="flex items-center gap-1.5">

          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Undo"
            aria-label="Undo action"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Redo"
            aria-label="Redo action"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              setZoomLevel((z) =>
                Math.min(z + 0.2, 2)
              )
            }
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              setZoomLevel((z) =>
                Math.max(z - 0.2, 0.6)
              )
            }
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel(1)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Reset Zoom"
            aria-label="Reset zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-rose-900/50 text-rose-300 hover:bg-rose-900"
            title="Clear All"
            aria-label="Clear all colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

        </div>

        {/* Actions */}

        <div className="flex items-center gap-2">

          <button
            onClick={handleSaveLocal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
          >
            {savedSuccess ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Save className="w-4 h-4" />
            )}

            <span className="hidden md:inline">
              {savedSuccess ? "Saved!" : "Save"}
            </span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
          >
            <Download className="w-4 h-4" />

            <span>
              Download PNG
            </span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
          >
            <Printer className="w-4 h-4" />

            <span className="hidden sm:inline">
              Print
            </span>
          </button>

        </div>
      </div>

      {/* =====================================================
          BRUSH SIZE
      ===================================================== */}

      {(activeTool === "brush" ||
        activeTool === "eraser") && (
        <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-xl text-xs text-slate-300">

          <span className="font-semibold">
            Brush Size: {brushSize}px
          </span>

          <input
            type="range"
            min="4"
            max="40"
            value={brushSize}
            onChange={(e) =>
              setBrushSize(
                Number(e.target.value)
              )
            }
            className="w-48 accent-indigo-500 cursor-pointer"
          />

        </div>
      )}

      {/* =====================================================
          CANVAS / SVG WORKSPACE
      ===================================================== */}

      <div
        className="
          relative
          w-full
          aspect-square
          max-h-[600px]
          bg-white
          rounded-2xl
          overflow-hidden
          shadow-inner
          flex
          items-center
          justify-center
          border
          border-slate-700/50
        "
      >

        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transition:
              "transform 0.15s ease-out",
          }}
          className="
            relative
            w-full
            h-full
            flex
            items-center
            justify-center
          "
        >

          {/* SVG */}

          <div
            ref={svgWrapperRef}
            onClick={handleSvgClick}
            className="
              absolute
              inset-0
              w-full
              h-full
              flex
              items-center
              justify-center
              select-none
            "
          />

          {/* =================================================
              CANVAS

              IMPORTANT:
              - pointer-events-none in Fill mode
              - pointer-events-auto in Brush/Eraser
              ================================================= */}

          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={(e) => {
              if (e.buttons === 0) {
                stopDrawing(e);
              }
            }}
            className={`
              absolute
              inset-0
              w-full
              h-full
              touch-none
              select-none
              ${
                activeTool === "fill"
                  ? "pointer-events-none"
                  : "pointer-events-auto cursor-crosshair"
              }
            `}
          />

        </div>
      </div>

      {/* =====================================================
          COLOR PALETTE
      ===================================================== */}

      <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center gap-2">

          <Sparkles className="w-4 h-4 text-amber-400" />

          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Color Palette
          </span>

        </div>

        <div className="flex flex-wrap items-center gap-2">

          {PRESET_COLORS.map((color) => {

            const isSelected =
              selectedColor.toLowerCase() ===
              color.toLowerCase();

            return (
              <button
                key={color}
                onClick={() =>
                  setSelectedColor(color)
                }
                style={{
                  backgroundColor: color,
                }}
                className={`
                  w-8
                  h-8
                  rounded-full
                  border-2
                  transition-transform
                  ${
                    isSelected
                      ? "border-white scale-125 shadow-lg"
                      : "border-slate-700 hover:scale-110"
                  }
                `}
                title={color}
                aria-label={`Select color ${color}`}
              />
            );
          })}

          <div className="relative inline-flex items-center ml-2">

            <input
              type="color"
              value={selectedColor}
              onChange={(e) =>
                setSelectedColor(
                  e.target.value
                )
              }
              className="
                w-9
                h-9
                rounded-full
                border-2
                border-slate-600
                bg-transparent
                cursor-pointer
                p-0
                overflow-hidden
              "
              title="Pick Custom Color"
            />

          </div>

        </div>
      </div>
    </div>
  );
}