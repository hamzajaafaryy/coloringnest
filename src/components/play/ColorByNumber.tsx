"use client";

import { useMemo, useState } from "react";
import { Check, RefreshCcw, Sparkles, Trophy } from "lucide-react";

type Artwork = { name: string; icon: string; colors: { name: string; hex: string }[]; rows: string[] };
const ART: Artwork[] = [
  {
    name: "Love Heart",
    icon: "💖",
    colors: [
      { name: "Purple", hex: "#7c3aed" },
      { name: "Bubblegum", hex: "#fb7185" },
      { name: "Strawberry", hex: "#e11d48" },
    ],
    rows: ["0000000000","0011101110","0112211221","1122222221","1223323321","1223333321","0123333210","0012332100","0001221000","0000110000"],
  },
  {
    name: "Happy Rainbow",
    icon: "🌈",
    colors: [
      { name: "Violet", hex: "#a855f7" },
      { name: "Pink", hex: "#fb7185" },
      { name: "Sunshine", hex: "#facc15" },
      { name: "Sky", hex: "#38bdf8" },
    ],
    rows: ["0000000000","0001111000","0012222100","0123333210","1234444321","1234004321","1234004321","0123003210","0012002100","0001001000"],
  },
  {
    name: "Pixel Kitty",
    icon: "🐱",
    colors: [
      { name: "Golden", hex: "#fbbf24" },
      { name: "Peach", hex: "#fb923c" },
      { name: "Pink", hex: "#fda4af" },
      { name: "Purple", hex: "#7c3aed" },
    ],
    rows: ["0000000000","0110000110","0121001210","0111111110","1121112111","1131113111","0111441110","0011111100","0001111000","0000110000"],
  },
  {
    name: "Dino Buddy",
    icon: "🦕",
    colors: [
      { name: "Mint", hex: "#4adeb2" },
      { name: "Green", hex: "#22c55e" },
      { name: "Orange", hex: "#fb923c" },
      { name: "Sky", hex: "#60a5fa" },
    ],
    rows: ["0000110000","0001221000","0001111100","0001111300","0001111000","0011111000","0112111100","0111111110","0010101010","0010303010"],
  },
  {
    name: "Magic Star",
    icon: "⭐",
    colors: [
      { name: "Sunny", hex: "#facc15" },
      { name: "Orange", hex: "#fb923c" },
      { name: "Pink", hex: "#f472b6" },
      { name: "Blue", hex: "#60a5fa" },
    ],
    rows: ["0000110000","0001111000","0011111100","1111111111","0111111110","0011221100","0012222100","0122002210","0120000210","0000000000"],
  },
];

export default function ColorByNumber({ onAward, onFeedback }: { onAward: (amount: number) => void; onFeedback?: (success: boolean) => void }) {
  const [design, setDesign] = useState(0);
  const [selected, setSelected] = useState("1");
  const [painted, setPainted] = useState<number[]>([]);
  const [hint, setHint] = useState("");
  const [finished, setFinished] = useState(false);
  const art = ART[design];
  const pixels = useMemo(() => art.rows.join("").split(""), [art]);
  const total = pixels.filter((digit) => digit !== "0").length;
  const found = new Set(painted);

  function pickArt(index: number) {
    setDesign(index);
    setSelected("1");
    setPainted([]);
    setFinished(false);
    setHint("");
  }

  function paint(index: number) {
    if (finished || found.has(index) || pixels[index] === "0") return;
    if (pixels[index] !== selected) {
      setHint(`Try picking color number ${pixels[index]} first! You can do it! 💜`);
      onFeedback?.(false);
      return;
    }
    const next = [...painted, index];
    setPainted(next);
    setHint("Great color choice! ✨");
    onFeedback?.(true);
    if (next.length === total) {
      setFinished(true);
      setHint("Amazing! You revealed the whole picture!");
      onAward(10);
    }
  }

  function showNextNumber() {
    const needed = pixels.filter((n, i) => n !== "0" && !found.has(i));
    if (needed.length) setSelected(needed[0]);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-sky-600">Game 04 · Little pixel artist</p>
          <h3 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">Color by Number 🔢</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Choose a numbered color, then tap the matching squares to reveal a surprise picture!</p>
        </div>
        <button type="button" onClick={() => pickArt(design)} className="cc-btn cc-btn-outline"><RefreshCcw className="h-4 w-4" /> Start over</button>
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Choose a picture">
        {ART.map((item, i) => <button type="button" key={item.name} aria-pressed={i===design}
          onClick={() => pickArt(i)}
          className={`rounded-2xl border-2 px-4 py-2.5 text-sm font-black transition ${i===design ? "border-violet-500 bg-violet-100 text-violet-800" : "border-slate-200 bg-white text-slate-700 hover:border-violet-300"}`}>
          {item.icon} {item.name}
        </button>)}
      </div>
      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[.7fr_1.3fr]">
        <div className="space-y-4 rounded-[1.7rem] bg-gradient-to-br from-sky-50 via-pink-50 to-yellow-50 p-5">
          <h4 className="text-lg font-black text-slate-900">1. Pick a paint number</h4>
          <div className="grid grid-cols-2 gap-3">
            {art.colors.map((color, i) => {
              const digit = String(i + 1);
              return <button type="button" key={digit} aria-pressed={selected===digit}
                onClick={() => { setSelected(digit); setHint(""); }}
                className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 bg-white px-3 py-2 shadow-sm transition hover:-translate-y-1 ${selected===digit ? "border-violet-500 ring-4 ring-violet-100" : "border-white"}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-white text-base font-black text-white shadow-md" style={{background:color.hex,textShadow:"0 1px 2px rgba(0,0,0,.5)"}}>{digit}</span>
                <span className="text-left text-xs font-black text-slate-800">{color.name}</span>
              </button>;
            })}
          </div>
          <p className="text-sm font-bold text-slate-600">2. Tap every square with the same number.</p>
          <button type="button" onClick={showNextNumber} className="cc-btn w-full border-2 border-sky-200 bg-white font-black text-sky-800 hover:bg-sky-50">✨ Show me the next number</button>
          <div className="rounded-2xl bg-white/90 p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-black text-slate-700"><span>Picture progress</span><span>{Math.round((painted.length/total)*100)}%</span></div>
            <div role="progressbar" aria-label="Color by Number progress" aria-valuenow={painted.length} aria-valuemin={0} aria-valuemax={total} className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-violet-500 to-pink-500 transition-all" style={{width:`${(painted.length/total)*100}%`}} />
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border-4 border-white bg-gradient-to-br from-[#d4f1ff] via-[#faf5ff] to-[#ffe7cf] p-3 shadow-inner sm:p-6">
          <div className="mx-auto grid w-full max-w-[510px] grid-cols-10 gap-[3px] rounded-2xl bg-white/60 p-2 shadow-sm sm:gap-1.5 sm:p-3">
            {pixels.map((digit, index) => {
              const empty = digit === "0";
              const done = found.has(index);
              const color = !empty && done ? art.colors[Number(digit)-1].hex : undefined;
              return empty ? <span key={index} className="aspect-square rounded-md bg-white/30" aria-hidden="true" /> :
                <button key={index} type="button" onClick={() => paint(index)}
                  disabled={done || finished}
                  aria-label={done ? `Square ${index+1}, colored` : `Square ${index+1}, number ${digit}`}
                  className={`flex aspect-square items-center justify-center rounded-md border border-violet-100 text-[11px] font-black transition duration-150 hover:scale-110 hover:ring-2 hover:ring-violet-500 sm:rounded-lg sm:text-sm ${done ? "border-transparent text-white shadow-sm" : "bg-white text-violet-600"}`}
                  style={{ backgroundColor: color }}
                >{done ? "" : digit}</button>;
            })}
          </div>
          <p role="status" aria-live="polite" className="mt-4 min-h-7 text-center text-sm font-extrabold text-violet-800">{hint || "Fill the numbers to make a little masterpiece!"}</p>
          {finished && <div className="mx-auto mt-4 max-w-sm rounded-2xl border-2 border-yellow-200 bg-white p-5 text-center shadow-lg">
            <Trophy className="mx-auto h-8 w-8 text-amber-500" />
            <h4 className="mt-2 text-xl font-black text-slate-900">Pixel Art Superstar! 🎉</h4>
            <p className="mt-1 text-sm text-slate-600">You earned 10 stars. Try the next picture!</p>
            <button type="button" onClick={() => pickArt((design+1)%ART.length)} className="cc-btn cc-btn-primary mt-4">Next picture <Check className="h-4 w-4" /></button>
          </div>}
        </div>
      </div>
    </div>
  );
}
