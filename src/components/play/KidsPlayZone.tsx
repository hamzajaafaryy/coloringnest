"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Brush, Brain, CheckCircle2, Gamepad2, Medal, Palette, Sparkles, Star, Trophy } from "lucide-react";
import ColorQuest from "./ColorQuest";
import MemoryGarden from "./MemoryGarden";
import DoodleStudio from "./DoodleStudio";

type Game = "colors" | "memory" | "doodle";
const STARS_KEY = "craftcoloring_kids_stars_v1";
const TABS: { id: Game; title: string; subtitle: string; emoji: string; color: string }[] = [
  { id: "colors", title: "Color Quest", subtitle: "Discover colors", emoji: "🌈", color: "from-pink-100 to-orange-100" },
  { id: "memory", title: "Memory Garden", subtitle: "Find the pairs", emoji: "🦋", color: "from-violet-100 to-sky-100" },
  { id: "doodle", title: "Doodle Studio", subtitle: "Make your own art", emoji: "🎨", color: "from-yellow-100 to-emerald-100" },
];

export default function KidsPlayZone() {
  const [active, setActive] = useState<Game>("colors");
  const [stars, setStars] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [spark, setSpark] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === "colors" || hash === "memory" || hash === "doodle") setActive(hash);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STARS_KEY);
      const saved = raw === null ? 0 : Number(raw);
      if (Number.isSafeInteger(saved) && saved >= 0) setStars(Math.min(saved, 999999));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STARS_KEY, String(stars)); } catch {}
  }, [stars, loaded]);

  const awardStars = useCallback((amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setStars((count) => Math.min(999999, count + amount));
    setSpark(true);
  }, []);

  const rank = stars >= 100 ? "Super Star Artist" : stars >= 40 ? "Rainbow Explorer" : stars >= 15 ? "Creative Adventurer" : "Little Explorer";
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#241b58] px-5 py-10 text-white shadow-[0_22px_70px_rgba(68,35,137,.22)] sm:rounded-[3rem] sm:px-10 sm:py-14 lg:px-14">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-pink-400/30 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-10 h-48 w-96 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-yellow-200">
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Welcome to the Play Zone
            </span>
            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl">
              Ready, set, <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-sky-300 bg-clip-text text-transparent">PLAY!</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-indigo-100 sm:text-lg">
              Three magical little adventures: discover colors, train your memory, and create your own masterpiece. Every game is free and made for little hands.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-white/85">
              <span className="rounded-full bg-white/15 px-3 py-2">✨ No sign-up</span>
              <span className="rounded-full bg-white/15 px-3 py-2">📱 Tablet friendly</span>
              <span className="rounded-full bg-white/15 px-3 py-2">🌟 Collect stars</span>
            </div>
          </div>
          <div className="relative flex min-h-48 items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur-lg sm:min-h-60">
            <div className="cc-float relative text-8xl drop-shadow-[0_12px_16px_rgba(0,0,0,.25)] sm:text-9xl" role="img" aria-label="Rainbow, butterfly and artist palette">🌈</div>
            <span className="cc-float-reverse absolute right-8 top-5 text-5xl" aria-hidden="true">🦋</span>
            <span className="cc-bounce-soft absolute bottom-4 left-8 text-5xl" aria-hidden="true">🎨</span>
            <span className="absolute right-8 bottom-5 text-3xl" aria-hidden="true">⭐</span>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-violet-100 bg-white px-5 py-4 shadow-sm sm:px-7">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100"><Trophy className="h-6 w-6 text-amber-600" aria-hidden="true" /></span>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-violet-600">Your artist passport</p>
            <p className="text-base font-black text-slate-900">{rank}</p>
          </div>
        </div>
        <div aria-live="polite" className="flex items-center gap-2 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-2 text-lg font-black text-amber-800">
          <Star className="h-6 w-6 fill-yellow-400 text-amber-500" aria-hidden="true" /> {loaded ? stars : "—"} stars
          {spark && <span className="text-xs font-black text-emerald-700" aria-label="Stars earned">+!</span>}
        </div>
      </div>

      <section aria-labelledby="choose-game">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[.19em] text-fuchsia-600">Choose your adventure</p>
            <h2 id="choose-game" className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">What shall we play today?</h2>
          </div>
          <span className="text-sm font-bold text-slate-500">Pick a card to start <ArrowRight className="inline h-4 w-4" aria-hidden="true" /></span>
        </div>
        <div role="tablist" aria-label="Creative games" className="grid gap-3 sm:grid-cols-3">
          {TABS.map((game) => (
            <button
              type="button"
              role="tab"
              aria-selected={active === game.id}
              aria-controls="kids-active-game"
              key={game.id}
              onClick={() => { setActive(game.id); setSpark(false); }}
              className={`group relative flex min-h-32 items-center gap-4 overflow-hidden rounded-[1.7rem] border-2 bg-gradient-to-br ${game.color} px-5 py-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-violet-600 sm:flex-col sm:items-start lg:flex-row lg:items-center ${active === game.id ? "border-violet-500 ring-4 ring-violet-100" : "border-white"}`}
            >
              <span className="text-5xl transition duration-300 group-hover:rotate-12 group-hover:scale-110" aria-hidden="true">{game.emoji}</span>
              <span className="min-w-0">
                <span className="block text-lg font-black text-slate-900">{game.title}</span>
                <span className="mt-1 block text-sm font-semibold text-slate-600">{game.subtitle}</span>
              </span>
              {active === game.id && <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-violet-600" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </section>

      <section id="kids-active-game" role="tabpanel" aria-label={TABS.find(g => g.id === active)?.title} className="overflow-hidden rounded-[2rem] border border-violet-100 bg-white p-4 shadow-[0_20px_70px_rgba(50,37,114,.07)] sm:p-7 lg:p-10">
        {active === "colors" && <ColorQuest onAward={awardStars} />}
        {active === "memory" && <MemoryGarden onAward={awardStars} />}
        {active === "doodle" && <DoodleStudio onAward={awardStars} />}
      </section>

      <div className="grid gap-4 rounded-[2rem] bg-gradient-to-r from-amber-50 via-pink-50 to-violet-50 p-6 sm:grid-cols-3 sm:p-8">
        <div className="flex items-start gap-3"><Medal className="h-7 w-7 shrink-0 text-amber-500" /><div><h3 className="font-black text-slate-900">Every try counts</h3><p className="mt-1 text-sm leading-6 text-slate-600">No countdowns or pressure. Play at your own pace.</p></div></div>
        <div className="flex items-start gap-3"><Brain className="h-7 w-7 shrink-0 text-purple-500" /><div><h3 className="font-black text-slate-900">Learning through play</h3><p className="mt-1 text-sm leading-6 text-slate-600">Practice recognizing colors, remembering and creating.</p></div></div>
        <div className="flex items-start gap-3"><Brush className="h-7 w-7 shrink-0 text-pink-500" /><div><h3 className="font-black text-slate-900">Your own creations</h3><p className="mt-1 text-sm leading-6 text-slate-600">Doodles and stars stay on this device, not in a public leaderboard.</p></div></div>
      </div>
    </div>
  );
}
