"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Brush, Brain, CheckCircle2, Medal, Palette, Sparkles, Star, Trophy, Volume2, VolumeX } from "lucide-react";
import ColorQuest from "./ColorQuest";
import MemoryGarden from "./MemoryGarden";
import DoodleStudio from "./DoodleStudio";
import ColorByNumber from "./ColorByNumber";
import CartoonColoring from "./CartoonColoring";
import GameIllustration from "./GameIllustration";
import CartoonCharacter from "./CartoonCharacters";

type Game = "cartoon" | "colors" | "memory" | "doodle" | "numbers";
const STARS_KEY = "craftcoloring_kids_stars_v1";
const AUDIO_KEY = "craftcoloring_sound_v1";
const TABS: { id: Game; title: string; subtitle: string; color: string }[] = [
  { id: "cartoon", title: "Cartoon Coloring", subtitle: "Paint magical friends", color: "bg-[#ffdae2]" },
  { id: "colors", title: "Rainbow Quest", subtitle: "Solve color puzzles", color: "bg-[#fff3d6]" },
  { id: "memory", title: "Memory Garden", subtitle: "Find cartoon pairs", color: "bg-[#e7deff]" },
  { id: "doodle", title: "Doodle Studio", subtitle: "Create your own art", color: "bg-[#ddf8e9]" },
  { id: "numbers", title: "Pixel Art Club", subtitle: "Color by numbers", color: "bg-[#e5f3ff]" },
];

function activeFromHash(): Game {
  if (typeof window === "undefined") return "cartoon";
  const id = window.location.hash.slice(1);
  if (TABS.some(tab => tab.id === id)) return id as Game;
  return "cartoon";
}

export default function KidsPlayZone() {
  const [active, setActive] = useState<Game>("cartoon");
  const [stars, setStars] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [spark, setSpark] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  const sound = useCallback((kind: "tap" | "correct" | "oops" | "win" | "paint" = "tap") => {
    if (!enabledRef.current || typeof window === "undefined") return;
    try {
      // Audio contexts on mobile become available after a user's first tap.
      const context = audioRef.current ?? new AudioContext();
      audioRef.current = context;
      if (context.state === "suspended") void context.resume();
      const melody: Record<typeof kind, number[]> = {
        tap: [440], correct: [523, 659, 784], oops: [392, 330],
        win: [523, 659, 784, 1047], paint: [660, 880],
      };
      const now = context.currentTime;
      melody[kind].forEach((frequency,index)=>{
        const osc = context.createOscillator();
        const gain = context.createGain();
        const start = now + index * 0.09;
        osc.type = kind === "oops" ? "triangle" : "sine";
        osc.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(kind==="tap" ? .035 : .075, start + .015);
        gain.gain.exponentialRampToValueAtTime(.0001, start + .16);
        osc.connect(gain).connect(context.destination);
        osc.start(start);
        osc.stop(start + .18);
      });
    } catch { /* audio is optional: games remain playable with silent browsers */ }
  }, []);

  useEffect(() => {
    setActive(activeFromHash());
    const onHashChange = () => setActive(activeFromHash());
    window.addEventListener("hashchange",onHashChange);
    return () => {
      window.removeEventListener("hashchange",onHashChange);
      if(audioRef.current) void audioRef.current.close();
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STARS_KEY);
      const saved = raw === null ? 0 : Number(raw);
      if (Number.isSafeInteger(saved) && saved >= 0) setStars(Math.min(saved,999999));
      const audio = localStorage.getItem(AUDIO_KEY);
      if(audio === "off"){ setSoundOn(false); enabledRef.current=false; }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if(!loaded)return;
    try {localStorage.setItem(STARS_KEY,String(stars));}catch{}
  },[stars,loaded]);

  const awardStars = useCallback((amount: number)=>{
    if (!Number.isFinite(amount) || amount <= 0)return;
    setStars(count=>Math.min(999999,count+amount));
    setSpark(true);
    sound(amount>=10 ? "win" : "correct");
  },[sound]);
  const feedback = useCallback((success:boolean)=>sound(success?"paint":"oops"),[sound]);

  function toggleAudio(){
    const next=!soundOn;
    enabledRef.current=next;
    setSoundOn(next);
    try{localStorage.setItem(AUDIO_KEY,next?"on":"off");}catch{}
    if(next)sound("correct");
  }
  function chooseGame(id:Game){
    setActive(id);
    setSpark(false);
    if(window.location.hash !== "#"+id)window.history.replaceState(null,"","#"+id);
    sound("tap");
  }

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = TABS.length - 1;
    else return;

    event.preventDefault();
    chooseGame(TABS[nextIndex].id);
    event.currentTarget.closest('[role="tablist"]')
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]
      ?.focus();
  }

  const rank = stars>=250?"Legendary Cartoon Artist":stars>=100?"Super Star Artist":stars>=40?"Rainbow Explorer":stars>=15?"Creative Adventurer":"Little Explorer";

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 overflow-x-clip px-3 pb-16 pt-5 sm:space-y-8 sm:px-6 sm:pt-8 lg:px-8">
      <section className="relative isolate overflow-hidden rounded-[1.7rem] border-2 border-[#2b2140] bg-[#4c3176] px-5 py-8 text-white shadow-[7px_7px_0_#2b2140] sm:rounded-[2.7rem] sm:px-10 sm:py-12 lg:px-14">
        <div className="relative grid min-w-0 items-center gap-4 md:grid-cols-[1.2fr_.8fr] md:gap-8">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-yellow-200 sm:px-4 sm:text-xs">
              <Sparkles className="h-4 w-4"/> The CraftColoring Creative Club
            </span>
            <h1 className="mt-5 max-w-xl text-[clamp(2.2rem,7vw,4.6rem)] font-black leading-[1.05] tracking-tight">
              Play, paint, <span className="text-[#ffd23f]">create!</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white sm:text-base">
              Meet original cartoon friends, build your own masterpiece and explore five playful art adventures. Made for little hands, big imaginations and touchscreen fun.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-black text-white/90 sm:text-xs">
              <span className="rounded-full border border-white/40 bg-white/10 px-3 py-2">5 creative games</span>
              <span className="rounded-full border border-white/40 bg-white/10 px-3 py-2">Original cartoon art</span>
              <span className="rounded-full border border-white/40 bg-white/10 px-3 py-2">Free, no account</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/color-online/" className="cc-btn border border-yellow-200 bg-yellow-300 text-violet-950 hover:bg-yellow-200"><Palette className="h-4 w-4"/> Full coloring library</Link>
              <Link href="/printable-coloring-pages/" className="cc-btn border border-white/25 bg-white/15 text-white hover:bg-white/25">Print artwork <ArrowRight className="h-4 w-4"/></Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[350px] rounded-[2rem] border-2 border-[#2b2140] bg-white p-2 shadow-[5px_5px_0_#2b2140]">
            <CartoonCharacter id="kitty" interactive={false} className="mx-auto block aspect-[4/3] w-full cc-float"/>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-[#2b2140] bg-white px-4 py-4 shadow-[5px_5px_0_rgba(43,33,64,0.14)] sm:rounded-3xl sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-[#2b2140] bg-[#ffd23f]"><Trophy className="h-6 w-6 text-[#2b2140]" aria-hidden="true"/></span>
          <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wider text-[#59398a]">Your artist passport</p><p className="text-sm font-black text-[#2b2140] sm:text-base">{rank}</p></div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" aria-pressed={soundOn} aria-label={soundOn?"Mute game audio":"Enable game audio"} onClick={toggleAudio}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-[#2b2140] bg-[#e7deff] px-3 py-2 text-xs font-black text-[#2b2140] shadow-[3px_3px_0_#2b2140] transition hover:bg-[#d9c9ff] sm:text-sm">
            {soundOn?<Volume2 className="h-5 w-5"/>:<VolumeX className="h-5 w-5"/>} Sound {soundOn?"ON":"OFF"}
          </button>
          <div aria-live="polite" className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-[#2b2140] bg-[#fff3d6] px-3 py-2 text-sm font-black text-[#2b2140] shadow-[3px_3px_0_rgba(43,33,64,0.2)]">
            <Star className="h-5 w-5 fill-yellow-400 text-amber-500"/> {loaded?stars:"—"} stars {spark&&<span className="text-xs text-emerald-700">+★</span>}
          </div>
        </div>
      </div>

      <section aria-labelledby="choose-game">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div className="min-w-0"><p className="text-[11px] font-black uppercase tracking-[.15em] text-fuchsia-600">Choose an adventure</p><h2 id="choose-game" className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">What will we create today?</h2></div>
          <p className="text-xs font-semibold text-[#514461]">Tap a game to start</p>
        </div>
        <div role="tablist" aria-label="Creative games" className="grid min-w-0 grid-cols-1 gap-3 min-[390px]:grid-cols-2 xl:grid-cols-5">
          {TABS.map(game=>(
            <button type="button" key={game.id} id={`game-tab-${game.id}`} role="tab" tabIndex={active === game.id ? 0 : -1} aria-selected={active===game.id} aria-controls="kids-active-game" onClick={()=>chooseGame(game.id)} onKeyDown={event => handleTabKeyDown(event, TABS.findIndex(tab => tab.id === game.id))}
              className={`group relative flex min-h-32 min-w-0 flex-col items-start overflow-hidden rounded-[1.5rem] border-2 ${game.color} p-3 text-left shadow-[4px_4px_0_rgba(43,33,64,0.14)] transition duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(43,33,64,0.16)] sm:p-4 ${active===game.id?"border-[#2b2140] ring-2 ring-[#8b5cf6]":"border-[#2b2140]/60"}`}>
              {game.id === "cartoon" ? <CartoonCharacter id="kitty" interactive={false} className="mx-auto aspect-[4/3] w-full max-w-[145px] transition-transform group-hover:scale-105"/> : <GameIllustration variant={game.id} className="mx-auto aspect-[4/3] w-full max-w-[145px] transition-transform group-hover:scale-105"/>}
              <span className="mt-auto block max-w-full text-[13px] font-black leading-tight text-[#2b2140] sm:text-base">{game.title}</span>
              <span className="mt-1 block text-[11px] font-semibold leading-tight text-[#514461] sm:text-xs">{game.subtitle}</span>
              {active===game.id&&<CheckCircle2 className="absolute right-2 top-2 h-5 w-5 text-[#2b2140]"/>}
            </button>
          ))}
        </div>
      </section>

      <section id="kids-active-game" role="tabpanel" aria-labelledby={`game-tab-${active}`}
        className="min-w-0 scroll-mt-24 overflow-hidden rounded-[1.5rem] border-2 border-[#2b2140] bg-white p-3 shadow-[6px_6px_0_rgba(43,33,64,0.16)] sm:rounded-[2rem] sm:p-7 lg:p-9">
        {active==="cartoon"&&<CartoonColoring onAward={awardStars} onFeedback={feedback}/>}
        {active==="colors"&&<ColorQuest onAward={awardStars} onFeedback={feedback}/>}
        {active==="memory"&&<MemoryGarden onAward={awardStars} onFeedback={feedback}/>}
        {active==="doodle"&&<DoodleStudio onAward={awardStars} onFeedback={feedback}/>}
        {active==="numbers"&&<ColorByNumber onAward={awardStars} onFeedback={feedback}/>}
      </section>

      <div className="grid gap-4 rounded-[1.5rem] border-2 border-[#2b2140] bg-[#fff3d6] p-5 shadow-[5px_5px_0_rgba(43,33,64,0.14)] sm:grid-cols-3 sm:rounded-[2rem] sm:p-8">
        <div className="flex items-start gap-3"><Medal className="h-7 w-7 shrink-0 text-[#2b2140]"/><div><h3 className="font-black text-[#2b2140]">Create at your pace</h3><p className="mt-1 text-sm leading-7 text-[#514461]">No countdowns or pressure. Explore, try and learn.</p></div></div>
        <div className="flex items-start gap-3"><Brain className="h-7 w-7 shrink-0 text-[#59398a]"/><div><h3 className="font-black text-[#2b2140]">Learn through art</h3><p className="mt-1 text-sm leading-7 text-[#514461]">Practice colors, creative thinking and memory.</p></div></div>
        <div className="flex items-start gap-3"><Brush className="h-7 w-7 shrink-0 text-[#b63d70]"/><div><h3 className="font-black text-[#2b2140]">Make it yours</h3><p className="mt-1 text-sm leading-7 text-[#514461]">Download art and keep your stars on this device.</p></div></div>
      </div>
    </div>
  );
}
