"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCcw, Sparkles, Trophy } from "lucide-react";

const FRIENDS = ["🦄", "🦋", "🐼", "🐸", "🐝", "🐬"];
type Card = { id: number; icon: string; pair: string };

function makeCards(shuffle: boolean): Card[] {
  const deck = FRIENDS.flatMap((icon, pair) => [
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
  const [cards, setCards] = useState<Card[]>(() => makeCards(false));
  const [opened, setOpened] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCards(makeCards(true));
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  function newGame() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setCards(makeCards(true)); setOpened([]); setMatched([]); setMoves(0); setBusy(false);
  }

  function flip(card: Card) {
    if (busy || opened.includes(card.id) || matched.includes(card.pair) || matched.length === FRIENDS.length) return;
    if (opened.length === 0) { setOpened([card.id]); return; }
    setMoves((n) => n + 1);
    const first = cards.find((entry) => entry.id === opened[0]);
    if (first?.pair === card.pair) {
      const newMatched = [...matched, card.pair];
      setMatched(newMatched);
      setOpened([]);
      onAward(3);
      if (newMatched.length === FRIENDS.length) onAward(8);
    } else {
      setOpened([opened[0], card.id]); setBusy(true);
      timer.current = setTimeout(() => { setOpened([]); setBusy(false); timer.current = null; }, 900);
    }
  }

  const finished = matched.length === FRIENDS.length;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-black uppercase tracking-widest text-violet-600">Game 02 · Brain power</p><h3 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">Memory Garden 🌼</h3><p className="mt-2 text-sm text-slate-600">Flip two cards and find the matching friends!</p></div>
        <button onClick={newGame} className="cc-btn cc-btn-outline"><RefreshCcw className="h-4 w-4" /> New game</button>
      </div>
      <div className="flex flex-wrap gap-3">
        <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-sky-800">🔎 {moves} tries</span>
        <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-800">🌟 {matched.length} / {FRIENDS.length} pairs</span>
      </div>
      {finished && <div role="status" className="rounded-3xl border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-pink-50 p-5 text-center">
        <div className="text-5xl" role="img" aria-label="Trophy">🏆</div><p className="mt-2 text-2xl font-black text-slate-900">You found every friend!</p><p className="mt-1 text-sm text-slate-600">Memory master! Bonus 8 stars earned.</p>
        <button onClick={newGame} className="cc-btn cc-btn-primary mt-4"><Trophy className="h-4 w-4" /> Play another round</button>
      </div>}
      <div className="grid grid-cols-3 gap-3 rounded-[2rem] bg-gradient-to-br from-violet-100 via-pink-50 to-sky-100 p-3 sm:grid-cols-4 sm:gap-4 sm:p-6">
        {cards.map(card => {
          const visible = opened.includes(card.id) || matched.includes(card.pair);
          const isMatched = matched.includes(card.pair);
          return <button type="button" key={card.id} onClick={() => flip(card)}
            disabled={isMatched || busy || finished}
            aria-label={visible ? `${card.icon} revealed` : "Turn over hidden card"}
            aria-pressed={visible}
            className={`relative flex aspect-[4/5] min-h-24 items-center justify-center rounded-[1.2rem] border-[3px] text-4xl shadow-md transition-all duration-200 sm:rounded-[1.7rem] sm:text-6xl ${isMatched ? "border-emerald-300 bg-emerald-50" : visible ? "border-white bg-white" : "border-violet-300 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 hover:-translate-y-1 hover:shadow-xl"}`}>
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
