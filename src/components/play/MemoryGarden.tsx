"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCcw, Sparkles, Trophy } from "lucide-react";

const FRIENDS = ["🦄", "🦋", "🐼", "🐸", "🐝", "🐬", "🦊", "🐙", "🐢", "🐧", "🐳", "🦁"];
type Card = { id: number; icon: string; pair: string };

function makeCards(shuffle: boolean, pairs = 6): Card[] {
  const deck = FRIENDS.slice(0, pairs).flatMap((icon, pair) => [
    { id: pair * 2, icon, pair: String(pair) },
    { id: pair * 2 + 1, icon, pair: String(pair) },
  ]);
  if (!shuffle) return deck;
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryGarden({ onAward }: { onAward: (amount: number) => void }) {
  const [level, setLevel] = useState(6);
  const [cards, setCards] = useState<Card[]>(() => makeCards(false));
  const [opened, setOpened] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCards(makeCards(true, level));
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [level]);

  function newGame() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setCards(makeCards(true, level)); setOpened([]); setMatched([]); setMoves(0); setBusy(false);
  }

  function flip(card: Card) {
    if (busy || opened.includes(card.id) || matched.includes(card.pair) || matched.length === level) return;
    if (opened.length === 0) { setOpened([card.id]); return; }
    setMoves((n) => n + 1);
    const first = cards.find((entry) => entry.id === opened[0]);
    if (first?.pair === card.pair) {
      const newMatched = [...matched, card.pair];
      setMatched(newMatched);
      setOpened([]);
      onAward(3);
      if (newMatched.length === level) onAward(8);
    } else {
      setOpened([opened[0], card.id]); setBusy(true);
      timer.current = setTimeout(() => { setOpened([]); setBusy(false); timer.current = null; }, 900);
    }
  }

  const finished = matched.length === level;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-black uppercase tracking-widest text-violet-600">Game 02 · Brain power</p><h3 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">Memory Garden 🌼</h3><p className="mt-2 text-sm text-slate-600">Flip two cards and find the matching friends!</p></div>
        <button onClick={newGame} className="cc-btn cc-btn-outline"><RefreshCcw className="h-4 w-4" /> New game</button>
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-violet-50 p-3" role="group" aria-label="Memory game difficulty">
        <span className="w-full text-xs font-black uppercase tracking-wider text-violet-700 sm:w-auto sm:mr-2">Choose your level</span>
        {([{pairs:4,name:"Easy · 8 cards"},{pairs:6,name:"Medium · 12 cards"},{pairs:12,name:"Expert · 24 cards"}] as const).map(option => <button key={option.pairs} type="button" aria-pressed={level===option.pairs} onClick={() => { setLevel(option.pairs); setOpened([]); setMatched([]); setMoves(0); setBusy(false); if(timer.current)clearTimeout(timer.current); }} className={`min-h-11 flex-1 rounded-xl px-3 py-2 text-xs font-black transition sm:flex-none ${level===option.pairs ? "bg-violet-700 text-white shadow-md" : "bg-white text-violet-800 hover:bg-violet-100"}`}>{option.name}</button>)}
      </div>
      <div className="flex flex-wrap gap-3">
        <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-sky-800">🔎 {moves} tries</span>
        <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">🌟 {matched.length} / {level} pairs</span>
      </div>
      {finished && <div role="status" className="rounded-3xl border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-pink-50 p-5 text-center">
        <div className="text-5xl" role="img" aria-label="Trophy">🏆</div><p className="mt-2 text-2xl font-black text-slate-900">You found every friend!</p><p className="mt-1 text-sm text-slate-600">Memory master! Bonus 8 stars earned.</p>
        <button onClick={newGame} className="cc-btn cc-btn-primary mt-4"><Trophy className="h-4 w-4" /> Play another round</button>
      </div>}
      <div className={`grid ${level===12 ? "grid-cols-4 sm:grid-cols-6" : "grid-cols-4"} gap-1.5 rounded-[1.25rem] bg-gradient-to-br from-violet-100 via-pink-50 to-sky-100 p-2 sm:gap-3 sm:p-5`}>
        {cards.map(card => {
          const visible = opened.includes(card.id) || matched.includes(card.pair);
          const isMatched = matched.includes(card.pair);
          return <button type="button" key={card.id} onClick={() => flip(card)}
            disabled={isMatched || busy || finished}
            aria-label={visible ? `${card.icon} revealed` : "Turn over hidden card"}
            aria-pressed={visible}
            className={`relative flex aspect-[4/5] min-h-0 min-w-0 items-center justify-center rounded-[1.2rem] border-[3px] text-2xl shadow-md sm:text-4xl transition-all duration-200 sm:rounded-[1.7rem] sm:text-5xl ${isMatched ? "border-emerald-300 bg-emerald-50" : visible ? "border-white bg-white" : "border-violet-300 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 hover:-translate-y-1 hover:shadow-xl"}`}>
            {visible ? <span role="img" aria-label={card.icon}>{card.icon}</span> :
              <span aria-hidden="true" className="select-none text-5xl font-black text-white drop-shadow-md sm:text-6xl">?</span>}
            {isMatched && <Sparkles className="absolute right-2 top-2 h-5 w-5 text-emerald-500" aria-hidden="true" />}
          </button>;
        })}
      </div>
      <p className="text-center text-xs font-semibold text-slate-500">No timer. No pressure. Just fun! 💜</p>
    </div>
  );
}
