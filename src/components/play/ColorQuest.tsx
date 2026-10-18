"use client";

import { useState } from "react";
import { ArrowRight, PartyPopper, RefreshCcw } from "lucide-react";

type Prompt = { clue: string; icon: string; answer: string };
const COLORS = [
  { name: "Red", hex: "#ef4444" },
  { name: "Orange", hex: "#f97316" },
  { name: "Yellow", hex: "#facc15" },
  { name: "Green", hex: "#22c55e" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Brown", hex: "#a16207" },
];
const CHAPTERS: { name: string; description: string; questions: Prompt[] }[] = [
  { name:"Rainbow Basics", description:"Learn the colors around you", questions:[
    { clue:"Find the color of a strawberry!", icon:"🍓", answer:"Red" },
    { clue:"What color is a sunny day?", icon:"☀️", answer:"Yellow" },
    { clue:"What color is the clear sky?", icon:"☁️", answer:"Blue" },
    { clue:"What color is fresh grass?", icon:"🌱", answer:"Green" },
    { clue:"What color is a carrot?", icon:"🥕", answer:"Orange" },
    { clue:"Pick the color of a grape!", icon:"🍇", answer:"Purple" },
    { clue:"Find the color of a flower!", icon:"🌸", answer:"Pink" },
    { clue:"What color is a teddy bear?", icon:"🧸", answer:"Brown" },
  ] },
  { name:"Nature Explorer", description:"Adventure through colorful nature", questions:[
    { clue:"What color is a ladybug?", icon:"🐞", answer:"Red" },
    { clue:"Pick the color of the ocean!", icon:"🌊", answer:"Blue" },
    { clue:"What color are ripe lemons?", icon:"🍋", answer:"Yellow" },
    { clue:"Find the color of a tree leaf!", icon:"🍃", answer:"Green" },
    { clue:"What color is a flamingo?", icon:"🦩", answer:"Pink" },
    { clue:"Pick the color of a pumpkin!", icon:"🎃", answer:"Orange" },
    { clue:"What color is an acorn?", icon:"🌰", answer:"Brown" },
    { clue:"Find the color of lavender!", icon:"💜", answer:"Purple" },
  ] },
  { name:"Cartoon Color Master", description:"Solve the ultimate cartoon color puzzles", questions:[
    { clue:"What color is a fire engine?", icon:"🚒", answer:"Red" },
    { clue:"Pick the color of a banana!", icon:"🍌", answer:"Yellow" },
    { clue:"What color are blueberries?", icon:"🫐", answer:"Blue" },
    { clue:"Find the color of broccoli!", icon:"🥦", answer:"Green" },
    { clue:"Pick the color of a basketball!", icon:"🏀", answer:"Orange" },
    { clue:"What color is an amethyst?", icon:"💎", answer:"Purple" },
    { clue:"Find the color of cotton candy!", icon:"🍬", answer:"Pink" },
    { clue:"What color is chocolate?", icon:"🍫", answer:"Brown" },
  ] },
];

export default function ColorQuest({ onAward, onFeedback }: { onAward: (amount: number) => void; onFeedback?: (success: boolean) => void }) {
  const [chapter, setChapter] = useState(0);
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [mistake, setMistake] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const questions = CHAPTERS[chapter].questions;
  const prompt = questions[round];

  function choose(name: string) {
    if (selected || complete) return;
    if (name === prompt.answer) {
      setSelected(name);
      setMistake(null);
      onAward(2);
      onFeedback?.(true);
    } else { setMistake(name); onFeedback?.(false); }
  }

  function next() {
    if (!selected) return;
    if (round === questions.length - 1) {
      setComplete(true);
      onAward(6);
    } else {
      setRound((n) => n + 1);
      setSelected(null);
      setMistake(null);
    }
  }

  function restart() {
    setRound(0); setSelected(null); setMistake(null); setComplete(false);
  }

  if (complete) return (
    <div className="flex min-h-96 flex-col items-center justify-center gap-4 rounded-[1.7rem] bg-gradient-to-br from-yellow-50 to-pink-100 p-8 text-center">
      <div className="cc-bounce-soft text-8xl" role="img" aria-label="Celebration">🏆</div>
      <h3 className="text-3xl font-black text-slate-900">You&apos;re a Color Champion!</h3>
      <p className="max-w-md text-base text-slate-600">You completed this chapter and earned six bonus stars. Three chapters await in our rainbow world!</p>
      <div className="flex flex-wrap justify-center gap-2"><button onClick={restart} className="cc-btn cc-btn-outline mt-3"><RefreshCcw className="h-5 w-5" /> Play again</button>{chapter < CHAPTERS.length - 1 && <button onClick={() => { setChapter(c => c + 1); restart(); }} className="cc-btn cc-btn-primary mt-3">Next chapter <ArrowRight className="h-5 w-5"/></button>}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><span className="text-xs font-black uppercase tracking-widest text-rose-500">Game 01 · Color detective</span><h3 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">Rainbow Quest: {CHAPTERS[chapter].name}</h3></div>
        <div className="rounded-full bg-violet-100 px-4 py-2 text-sm font-black text-violet-700">Chapter {chapter+1} · {round + 1}/{questions.length}</div>
      </div>
      <div role="group" aria-label="Rainbow Quest chapters" className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-3">
        {CHAPTERS.map((world, index) => <button key={world.name} type="button" aria-pressed={chapter===index} onClick={() => { setChapter(index); restart(); }} className={`min-w-0 rounded-xl border-2 px-3 py-3 text-left transition ${chapter===index?"border-violet-500 bg-violet-100":"border-slate-100 bg-white hover:border-violet-200"}`}>
          <span className="block text-[10px] font-black uppercase tracking-wide text-violet-600">World {index+1}</span>
          <span className="mt-1 block text-sm font-black text-slate-900">{world.name}</span>
          <span className="block text-[11px] leading-tight text-slate-500">{world.description}</span>
        </button>)}
      </div>
      <div role="progressbar" aria-label="Color Quest progress" aria-valuenow={round} aria-valuemin={0} aria-valuemax={questions.length} className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-500 transition-all duration-500" style={{ width: `${(round / questions.length) * 100}%` }} />
      </div>

      <div className="grid items-center gap-7 lg:grid-cols-[.7fr_1.3fr]">
        <div className="flex min-h-48 flex-col items-center justify-center rounded-[2rem] bg-gradient-to-br from-pink-100 via-yellow-50 to-violet-100 px-4 py-7 text-center">
          <div className="cc-bounce-soft text-8xl drop-shadow-lg sm:text-9xl" role="img" aria-label={prompt.clue}>{prompt.icon}</div>
          <p className="mt-5 text-xl font-black leading-7 text-slate-900 sm:text-2xl">{prompt.clue}</p>
        </div>
        <div>
          <p className="mb-4 text-sm font-extrabold text-slate-500">Tap one of the colorful bubbles:</p>
          <div className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-4 sm:gap-4">
            {COLORS.map((color) => (
              <button
                type="button"
                key={color.name}
                disabled={Boolean(selected)}
                onClick={() => choose(color.name)}
                aria-label={color.name}
                aria-pressed={selected === color.name}
                className={`group rounded-[1.4rem] border-2 p-2 transition duration-200 hover:-translate-y-1 hover:shadow-xl disabled:cursor-default sm:p-3 ${selected === color.name ? "border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100" : mistake === color.name ? "border-pink-400 bg-pink-50" : "border-slate-100 bg-white hover:border-violet-300"}`}
              >
                <span className="mx-auto block aspect-square w-full rounded-2xl border-4 border-white shadow-inner transition-transform group-hover:scale-105" style={{backgroundColor:color.hex}} />
                <span className="mt-2 block text-center text-[11px] font-black text-slate-700 sm:text-sm">{color.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-5 min-h-9" role="status" aria-live="polite">
            {selected ? <p className="flex items-center gap-2 text-lg font-black text-emerald-700"><PartyPopper className="h-6 w-6" /> You got it! +2 ⭐</p>
              : mistake ? <p className="text-sm font-bold text-rose-600">Not quite! Look closely and try another color. 💜</p>
              : <p className="text-sm font-semibold text-slate-500">You can try as many times as you like.</p>}
          </div>
          <button type="button" disabled={!selected} onClick={next} className="cc-btn cc-btn-primary mt-3 w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">
            {round === questions.length - 1 ? "Finish quest!" : "Next color"} <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
