"use client";

import { useState } from "react";
import { ArrowRight, PaintBucket, Redo2, RotateCcw, Undo2 } from "lucide-react";
import { artwork } from "@/lib/colorquest/artwork";
import { PALETTE, type Friend, type Paint } from "@/lib/colorquest/story";

interface Props {
  chapter: number;
  friend: Friend;
  initialPaint: Paint;
  onChange: (paint: Paint) => void;
  onComplete: () => void;
}
export default function QuestPainter({
  chapter,
  friend,
  initialPaint,
  onChange,
  onComplete,
}: Props) {
  const [color, setColor] = useState(PALETTE[7]);
  const [history, setHistory] = useState<Paint[]>([initialPaint]);
  const [cursor, setCursor] = useState(0);
  const [lastRegion, setLastRegion] = useState("");
  const paint = history[cursor];
  function colorRegion(target: EventTarget | null) {
    const region =
      target instanceof Element ? target.closest("[data-region]") : null;
    const id = region?.getAttribute("data-region");
    if (!id || paint[id] === color) return;
    const next = { ...paint, [id]: color };
    setHistory([...history.slice(0, cursor + 1), next].slice(-60));
    setCursor(Math.min(cursor + 1, 59));
    setLastRegion(
      region?.getAttribute("aria-label")?.replace(/^Color /, "") || "part",
    );
    onChange(next);
  }
  function move(next: number) {
    setCursor(next);
    onChange(history[next]);
  }
  function reset() {
    const next = [...history.slice(0, cursor + 1), {}].slice(-60);
    setHistory(next);
    setCursor(next.length - 1);
    onChange({});
  }
  return (
    <div className="min-w-0 rounded-[2rem] border border-violet-100 bg-white p-3 shadow-xl shadow-violet-100/40 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-bold text-slate-600">
          <PaintBucket className="h-4 w-4 shrink-0 text-violet-600" /> Pick a
          color. Tap a shape.
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => move(cursor - 1)}
            disabled={cursor === 0}
            aria-label="Undo color"
            className="cq-tool"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => move(cursor + 1)}
            disabled={cursor === history.length - 1}
            aria-label="Redo color"
            className="cq-tool"
          >
            <Redo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={!Object.keys(paint).length}
            aria-label="Clear chapter colors"
            className="cq-tool"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        className="cq-art cq-interactive-art overflow-hidden rounded-2xl border border-slate-100 bg-white"
        onClick={(event) => colorRegion(event.target)}
        onKeyDown={(event) => {
          if (
            (event.key === "Enter" || event.key === " ") &&
            event.target instanceof Element &&
            event.target.hasAttribute("data-region")
          ) {
            event.preventDefault();
            colorRegion(event.target);
          }
        }}
        dangerouslySetInnerHTML={{
          __html: artwork(chapter, friend, paint, true),
        }}
      />
      <div
        className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10"
        role="group"
        aria-label="Choose a color"
      >
        {PALETTE.map((value, index) => (
          <button
            type="button"
            key={value}
            aria-label={`Choose ${["red", "orange", "yellow", "green", "teal", "sky blue", "blue", "purple", "pink", "brown"][index]}`}
            aria-pressed={color === value}
            onClick={() => setColor(value)}
            className={`flex min-h-12 min-w-0 items-center justify-center rounded-xl border-2 transition ${color === value ? "border-slate-800 bg-slate-50" : "border-transparent hover:bg-violet-50"}`}
          >
            <span
              className="h-8 w-8 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: value }}
            />
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <label className="flex min-h-12 items-center gap-2 text-xs font-bold text-slate-600">
          Your own color
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            aria-label="Choose a custom color"
            className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
          />
        </label>
        <p aria-live="polite" className="text-xs text-slate-500">
          {lastRegion
            ? `Colored ${lastRegion}.`
            : "You can use any colors you like!"}
        </p>
      </div>
      <button
        type="button"
        disabled={!Object.keys(paint).length}
        onClick={onComplete}
        className="cc-btn cc-btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-45 disabled:transform-none"
      >
        {chapter === 3 ? "Finish my storybook" : "Save chapter & keep going"}
        <ArrowRight className="h-4 w-4 shrink-0" />
      </button>
      {!Object.keys(paint).length && (
        <p className="mt-2 text-center text-xs text-slate-500">
          Color at least one shape to continue.
        </p>
      )}
    </div>
  );
}
