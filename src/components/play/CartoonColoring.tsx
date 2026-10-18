"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Download, Eraser, RotateCcw, Sparkles, Undo2, WandSparkles } from "lucide-react";

type Region = { id: string; label: string; d: string };
type Character = { id: string; name: string; subtitle: string; background: string; regions: Region[] };
const INK = "#3b315d";
const PALETTE = [
  { name: "Coral", hex: "#fb7185" },
  { name: "Sunshine", hex: "#fbbf24" },
  { name: "Mint", hex: "#4adeb2" },
  { name: "Sky", hex: "#60a5fa" },
  { name: "Lavender", hex: "#a78bfa" },
  { name: "Candy", hex: "#f472b6" },
  { name: "Orange", hex: "#fb923c" },
  { name: "Ocean", hex: "#14b8a6" },
  { name: "Cream", hex: "#fef3c7" },
  { name: "Snow", hex: "#ffffff" },
];
const CHARACTERS: Character[] = [
  {
    id: "kitty", name: "Mochi the Kitty", subtitle: "A playful kitten in the flower garden", background: "#e6f8ff",
    regions: [
      { id:"tail",label:"curly tail",d:"M410 333 Q486 286 488 353 Q492 408 446 400 Q422 391 437 373 Q451 357 462 376 Q474 358 446 348 Z" },
      { id:"body",label:"kitty body",d:"M255 282 C226 301 213 374 238 407 Q317 446 403 406 C433 379 411 312 376 286 Z" },
      { id:"belly",label:"tummy",d:"M300 319 Q329 303 358 321 Q386 355 363 394 Q328 417 291 391 Q273 356 300 319 Z" },
      { id:"left-paw",label:"left paw",d:"M248 377 Q208 373 207 401 Q209 429 267 426 Q287 418 270 396 Z" },
      { id:"right-paw",label:"right paw",d:"M383 386 Q433 373 445 402 Q450 431 389 430 Q362 424 383 386 Z" },
      { id:"ear-left",label:"left ear",d:"M248 213 L235 102 Q236 83 258 97 L325 158 Z" },
      { id:"ear-right",label:"right ear",d:"M346 156 L410 92 Q431 80 430 102 L416 220 Z" },
      { id:"inner-left",label:"left ear pink",d:"M267 174 L257 123 L301 163 Z" },
      { id:"inner-right",label:"right ear pink",d:"M374 163 L411 124 L398 183 Z" },
      { id:"head",label:"kitty face",d:"M251 179 Q315 128 397 175 Q444 209 420 285 Q393 334 328 335 Q266 338 230 283 Q209 214 251 179 Z" },
      { id:"scarf",label:"little scarf",d:"M272 323 Q333 345 388 313 L390 343 Q340 374 276 346 Z" },
      { id:"scarf-tail",label:"scarf bow",d:"M367 342 Q419 342 412 394 L390 380 L377 408 L353 369 Z" },
    ],
  },
  {
    id: "unicorn", name: "Luna the Unicorn", subtitle: "Magical clouds and rainbow dreams", background: "#f2eafe",
    regions: [
      { id:"tail-back",label:"flowing tail",d:"M424 285 Q504 249 512 305 Q537 361 464 400 Q504 337 457 345 L420 367 Z" },
      { id:"body",label:"unicorn body",d:"M246 267 Q308 236 405 260 Q441 293 417 396 Q347 430 259 405 Q214 367 246 267 Z" },
      { id:"back-leg",label:"back leg",d:"M385 368 Q421 364 425 411 L418 435 L380 433 L372 402 Z" },
      { id:"front-leg",label:"front leg",d:"M266 369 Q301 365 312 400 L306 435 L265 435 L255 398 Z" },
      { id:"neck",label:"unicorn neck",d:"M265 276 L273 180 Q301 135 367 166 L366 299 Q330 326 265 276 Z" },
      { id:"ear",label:"unicorn ear",d:"M318 162 L300 94 Q301 73 321 88 L356 151 Z" },
      { id:"mane-back",label:"flowing mane",d:"M360 157 Q427 171 420 231 Q435 266 392 312 Q411 258 367 258 Z" },
      { id:"face",label:"unicorn face",d:"M280 166 Q323 140 366 166 Q397 205 370 254 Q332 281 275 247 Q238 234 250 198 Z" },
      { id:"muzzle",label:"nose area",d:"M249 218 Q284 207 313 236 Q315 267 275 270 Q238 263 249 218 Z" },
      { id:"mane-one",label:"top mane",d:"M316 147 Q368 113 394 159 Q394 180 362 194 Q357 159 333 183 Z" },
      { id:"mane-two",label:"front mane",d:"M357 185 Q403 204 375 242 Q350 257 352 218 Z" },
      { id:"horn",label:"magic horn",d:"M331 150 L352 66 L370 150 Z" },
      { id:"saddle",label:"star saddle",d:"M309 288 Q368 272 410 297 L393 352 Q356 376 314 346 Z" },
    ],
  },
  {
    id: "dino", name: "Dizzy the Dino", subtitle: "A friendly dinosaur from Dino Valley", background: "#e9fbef",
    regions: [
      { id:"tail",label:"dinosaur tail",d:"M405 338 Q520 349 539 280 Q545 373 466 416 L394 396 Z" },
      { id:"back-spikes",label:"back spikes",d:"M378 196 L399 146 L423 193 L448 164 L459 222 L486 210 L470 261 L495 275 L459 299 Z" },
      { id:"body",label:"dinosaur body",d:"M258 260 Q302 201 390 246 Q448 283 427 380 Q402 429 320 422 Q246 420 217 369 Q198 315 258 260 Z" },
      { id:"belly",label:"dinosaur tummy",d:"M267 309 Q323 290 361 331 Q385 376 357 414 Q294 427 261 393 Q239 349 267 309 Z" },
      { id:"leg-left",label:"left foot",d:"M258 386 L305 394 Q315 431 296 441 L239 441 Q226 428 258 386 Z" },
      { id:"leg-right",label:"right foot",d:"M372 387 L414 384 Q436 425 419 441 L367 441 Q355 427 372 387 Z" },
      { id:"neck",label:"dinosaur neck",d:"M236 307 Q226 245 235 196 Q240 153 287 156 Q325 179 313 251 L300 335 Z" },
      { id:"head",label:"dinosaur face",d:"M229 171 Q248 112 311 122 Q370 125 377 180 Q381 228 331 246 Q275 249 240 223 Q206 213 229 171 Z" },
      { id:"snout",label:"dinosaur snout",d:"M230 193 Q268 174 308 201 Q314 243 268 254 Q225 250 220 225 Z" },
      { id:"crest-one",label:"first crest",d:"M260 131 L277 74 L298 129 Z" },
      { id:"crest-two",label:"second crest",d:"M309 132 L334 79 L346 153 Z" },
      { id:"cheek",label:"rosy cheek",d:"M317 205 Q341 191 351 212 Q342 235 319 231 Z" },
    ],
  },
];

type PaintHistory = Record<string, string>;
export default function CartoonColoring({ onAward, onFeedback }: { onAward: (amount: number) => void; onFeedback?: (success: boolean) => void }) {
  const [characterIndex, setCharacterIndex] = useState(0);
  const [paint, setPaint] = useState<PaintHistory>({});
  const [history, setHistory] = useState<PaintHistory[]>([]);
  const [color, setColor] = useState(PALETTE[0].hex);
  const [message, setMessage] = useState("Pick a color and tap a piece of your cartoon!");
  const [wins, setWins] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const char = CHARACTERS[characterIndex];
  const paintedCount = char.regions.filter(region => paint[region.id]).length;
  const complete = paintedCount === char.regions.length;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("craftcoloring_cartoon_wins_v1") || "[]");
      if (Array.isArray(saved)) setWins(saved.filter((id): id is string => typeof id === "string" && CHARACTERS.some(c => c.id === id)));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("craftcoloring_cartoon_wins_v1", JSON.stringify(wins)); } catch {}
  }, [wins, ready]);

  const allRegions = useMemo(() => new Set(char.regions.map(region => region.id)), [char]);
  function chooseCharacter(next: number) {
    setCharacterIndex(next);
    setPaint({});
    setHistory([]);
    setMessage("Your next cartoon friend is ready. Let's color!");
  }
  function fillRegion(id: string) {
    if (!allRegions.has(id) || paint[id] === color) return;
    setHistory(previous => [...previous.slice(-29), paint]);
    const next = { ...paint, [id]: color };
    setPaint(next);
    const firstCompletion = char.regions.every(region => next[region.id]) && !wins.includes(char.id);
    if (firstCompletion) {
      setWins(previous => [...previous, char.id]);
      setMessage("Fantastic cartoon! You unlocked 15 artist stars!");
      onAward(15);
    } else {
      setMessage("Beautiful brushwork! Keep going.");
      onFeedback?.(true);
    }
  }
  function undo() {
    if (!history.length) return;
    setPaint(history[history.length - 1]);
    setHistory(previous => previous.slice(0, -1));
    setMessage("Last color undone.");
    onFeedback?.(false);
  }
  async function download() {
    const svg = svgRef.current;
    if (!svg) return;
    try {
      const xml = new XMLSerializer().serializeToString(svg);
      const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1280; canvas.height = 960;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const link = document.createElement("a");
          link.download = "craftcoloring-" + char.id + ".png";
          link.href = canvas.toDataURL("image/png");
          link.click();
          setMessage("Saved! Your cartoon masterpiece is yours to keep.");
        }
        URL.revokeObjectURL(url);
      };
      image.onerror = () => { URL.revokeObjectURL(url); setMessage("Download unavailable in this browser."); };
      image.src = url;
    } catch { setMessage("Download unavailable in this browser."); }
  }
  return (
    <div className="min-w-0 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[.15em] text-fuchsia-600">Art adventure · Interactive coloring</p>
          <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">Cartoon Coloring Studio</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Color original cartoon friends, one shape at a time. Save your masterpiece as a picture!</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-amber-100 px-4 py-2 text-sm font-black text-amber-900"><Sparkles className="h-4 w-4"/> {wins.length} / 3 friends finished</div>
      </div>
      <div role="group" aria-label="Choose a cartoon character" className="grid grid-cols-1 gap-2 min-[390px]:grid-cols-3">
        {CHARACTERS.map((friend, index) => (
          <button key={friend.id} type="button" onClick={() => chooseCharacter(index)} aria-pressed={index === characterIndex}
            className={`flex min-w-0 items-center justify-between gap-2 rounded-2xl border-2 p-3 text-left transition focus-visible:outline-violet-700 ${index === characterIndex ? "border-violet-500 bg-violet-100 shadow-md" : "border-slate-100 bg-white hover:border-violet-200"}`}>
            <span className="min-w-0"><strong className="block truncate text-xs font-black text-slate-900 sm:text-sm">{friend.name}</strong><span className="block text-[11px] text-slate-500">Scene {index + 1}</span></span>
            {wins.includes(friend.id) ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600"/> : <span className="h-3 w-3 shrink-0 rounded-full bg-fuchsia-400"/>}
          </button>
        ))}
      </div>

      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_235px]">
        <div className="min-w-0 overflow-hidden rounded-[1.5rem] border-[5px] border-white bg-white shadow-[0_16px_40px_rgba(80,66,140,.15)] sm:rounded-[2rem] sm:border-8">
          <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" role="img" aria-label={`Coloring picture of ${char.name}`} className="block h-auto w-full touch-manipulation">
            <rect width="640" height="480" fill={char.background}/>
            <circle cx="525" cy="79" r="42" fill="#fff6bd" opacity=".9"/>
            <g fill="#ffffff" opacity=".94"><ellipse cx="91" cy="86" rx="49" ry="21"/><ellipse cx="125" cy="73" rx="35" ry="26"/><ellipse cx="471" cy="132" rx="39" ry="16"/><ellipse cx="496" cy="117" rx="28" ry="20"/></g>
            <path d="M0 376 Q155 310 302 369 T640 357 L640 480 H0 Z" fill="#c9f3d3"/>
            <path d="M0 415 Q190 367 353 412 T640 404 L640 480 H0 Z" fill="#a5e1be"/>
            <g fill="#f8b4d9" opacity=".9">
              <circle cx="91" cy="406" r="9"/><circle cx="91" cy="390" r="6"/><circle cx="79" cy="397" r="6"/><circle cx="103" cy="397" r="6"/>
              <circle cx="558" cy="394" r="9"/><circle cx="558" cy="379" r="6"/><circle cx="546" cy="388" r="6"/><circle cx="570" cy="388" r="6"/>
            </g>
            {char.regions.map(region => (
              <path key={region.id} d={region.d} fill={paint[region.id] || "#ffffff"} stroke={INK} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round"
                role="button" tabIndex={0} aria-label={`Color the ${region.label}`}
                onClick={() => fillRegion(region.id)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); fillRegion(region.id); } }}
                className="cursor-pointer transition-[fill] duration-200 hover:brightness-95 focus:outline-none focus:stroke-fuchsia-600"/>
            ))}
            {char.id === "kitty" && <g fill={INK} pointerEvents="none">
              <ellipse cx="287" cy="245" rx="7" ry="12"/><ellipse cx="370" cy="245" rx="7" ry="12"/>
              <path d="M317 269 Q328 282 340 269 L329 266 Z"/>
              <path d="M329 279 Q316 298 302 286 M329 279 Q342 298 356 286" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round"/>
              <path d="M263 277 L214 268 M265 288 L214 292 M390 279 L441 271 M387 290 L441 296" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round"/>
              <ellipse cx="268" cy="273" rx="14" ry="7" fill="#f9adc0" opacity=".7"/><ellipse cx="392" cy="273" rx="14" ry="7" fill="#f9adc0" opacity=".7"/>
            </g>}
            {char.id === "unicorn" && <g pointerEvents="none">
              <path d="M305 204 Q323 227 344 200" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none"/>
              <path d="M315 208 L308 219 M326 212 L326 224 M337 207 L345 217" stroke={INK} strokeWidth="3" strokeLinecap="round"/>
              <ellipse cx="261" cy="238" rx="5" ry="4" fill={INK}/>
              <circle cx="367" cy="317" r="14" fill="#fff7b3" stroke="#f5ab48" strokeWidth="3"/>
              <path d="M367 305 L370 313 L379 315 L372 322 L372 331 L365 325 L357 330 L360 319 L354 313 L364 312 Z" fill="#f59e0b"/>
            </g>}
            {char.id === "dino" && <g pointerEvents="none" fill={INK}>
              <circle cx="326" cy="181" r="9"/><circle cx="330" cy="178" r="3" fill="white"/>
              <ellipse cx="247" cy="224" rx="4" ry="3"/>
              <path d="M269 244 Q290 259 310 241" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round"/>
              <circle cx="409" cy="327" r="7" opacity=".4"/><circle cx="395" cy="350" r="11" opacity=".25"/>
            </g>}
            <g fill="#fff" opacity=".8" pointerEvents="none"><circle cx="84" cy="207" r="4"/><circle cx="500" cy="195" r="5"/><circle cx="538" cy="238" r="3"/></g>
          </svg>
        </div>
        <aside className="min-w-0 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-violet-100 via-fuchsia-50 to-amber-50 p-4">
            <h4 className="flex items-center gap-2 text-base font-black text-slate-900"><WandSparkles className="h-5 w-5 text-violet-600"/> Your paintbox</h4>
            <p className="mt-1 text-xs font-semibold text-slate-600">Pick a color, then tap a shape in the picture.</p>
            <div role="group" aria-label="Paint colors" className="mt-4 grid grid-cols-5 gap-2">
              {PALETTE.map(shade => (
                <button key={shade.hex} type="button" aria-label={shade.name} title={shade.name} aria-pressed={color === shade.hex}
                  onClick={() => { setColor(shade.hex); onFeedback?.(true); }}
                  className={`aspect-square min-h-9 w-full rounded-xl border-[3px] border-white shadow-sm transition active:scale-95 ${color === shade.hex ? "ring-[3px] ring-violet-600 ring-offset-2" : "hover:scale-110"}`}
                  style={{ backgroundColor: shade.hex }}/>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between gap-2 text-xs font-black text-slate-700"><span>Coloring progress</span><span>{paintedCount} / {char.regions.length}</span></div>
            <div role="progressbar" aria-label="Coloring progress" aria-valuenow={paintedCount} aria-valuemin={0} aria-valuemax={char.regions.length} className="mt-2 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-gradient-to-r from-rose-400 via-violet-500 to-cyan-400 transition-all" style={{ width: `${100 * paintedCount / char.regions.length}%` }}/>
            </div>
            {complete && <p role="status" className="mt-3 rounded-xl bg-emerald-100 px-3 py-2 text-sm font-black text-emerald-800">🎉 Masterpiece complete!</p>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={undo} type="button" disabled={!history.length} className="cc-btn cc-btn-outline min-w-0 text-xs disabled:opacity-40"><Undo2 className="h-4 w-4"/> Undo</button>
            <button onClick={() => { setHistory(previous => [...previous.slice(-29), paint]); setPaint({}); setMessage("A clean canvas!"); }} type="button" className="cc-btn cc-btn-outline min-w-0 text-xs"><RotateCcw className="h-4 w-4"/> Restart</button>
            <button onClick={() => { setColor("#ffffff"); setMessage("Eraser selected."); }} type="button" className="cc-btn cc-btn-outline min-w-0 text-xs"><Eraser className="h-4 w-4"/> White</button>
            <button onClick={download} type="button" className="cc-btn cc-btn-primary min-w-0 text-xs"><Download className="h-4 w-4"/> Save PNG</button>
          </div>
          <p role="status" aria-live="polite" className="min-h-12 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-violet-700">{message}</p>
        </aside>
      </div>
    </div>
  );
}
