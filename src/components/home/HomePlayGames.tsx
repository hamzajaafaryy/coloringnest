import Link from "next/link";
import { ArrowRight, Gamepad2, Sparkles } from "lucide-react";

const games = [
  {
    emoji: "🌈",
    title: "Color Quest",
    description: "Can you find the color? Tap the right rainbow bubbles and collect shiny stars.",
    detail: "8 happy challenges",
    href: "/play/#colors",
    gradient: "from-[#ff8fa3] via-[#ffb870] to-[#ffe17a]",
    dark: "text-rose-950",
  },
  {
    emoji: "🦋",
    title: "Memory Garden",
    description: "Flip the magic cards, discover cute animals and find every matching pair!",
    detail: "6 adorable pairs",
    href: "/play/#memory",
    gradient: "from-[#9e85ff] via-[#bab7ff] to-[#8ce3ff]",
    dark: "text-violet-950",
  },
  {
    emoji: "🎨",
    title: "Doodle Studio",
    description: "Draw anything you dream, drop stickers and save your very own masterpiece.",
    detail: "Create and save PNG",
    href: "/play/#doodle",
    gradient: "from-[#ffe382] via-[#b9efaa] to-[#79ded6]",
    dark: "text-emerald-950",
  },
  {
    emoji: "🔢",
    title: "Color by Number",
    description: "Match numbers with colors and watch secret pixel art pictures appear!",
    detail: "2 surprise pictures",
    href: "/play/#numbers",
    gradient: "from-[#8cdafb] via-[#c1b1ff] to-[#ffa3cf]",
    dark: "text-indigo-950",
  },
];

export default function HomePlayGames() {
  return (
    <section aria-labelledby="playzone-home-title" className="relative overflow-hidden rounded-[2.7rem] bg-[#221957] px-5 py-9 text-white shadow-[0_22px_70px_rgba(37,24,96,.16)] sm:px-9 sm:py-12 lg:px-12">
      <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-pink-500/30 blur-3xl"/>
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-400/25 blur-3xl"/>
      <div className="relative mb-7 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-300 px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-slate-950"><Sparkles className="h-4 w-4" /> New • Kids Play Zone</span>
          <h2 id="playzone-home-title" className="mt-5 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">Play, giggle &amp; <span className="text-yellow-300">grow your imagination!</span></h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">More than coloring pages. Four real free mini-games where every little artist can learn, create, and shine!</p>
        </div>
        <Link href="/play/" className="cc-btn border border-white/30 bg-white px-5 py-3 font-black text-violet-800 hover:bg-yellow-100">All kids games <ArrowRight className="h-5 w-5" /></Link>
      </div>
      <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {games.map((game, index) => <Link key={game.href} href={game.href}
          className={`group relative flex min-h-72 flex-col justify-between overflow-hidden rounded-[1.8rem] bg-gradient-to-br ${game.gradient} p-6 shadow-[0_18px_30px_rgba(0,0,0,.08)] transition duration-300 hover:-translate-y-2 hover:rotate-[-1deg] hover:shadow-xl ${game.dark}`}>
          <span className="absolute right-4 top-4 rounded-full border border-white/60 bg-white/50 px-3 py-1.5 text-[11px] font-black tracking-wide">GAME 0{index + 1}</span>
          <div className="text-7xl transition duration-300 group-hover:scale-110 group-hover:-rotate-12" aria-hidden="true">{game.emoji}</div>
          <div>
            <h3 className="text-2xl font-black">{game.title}</h3>
            <p className="mt-2 max-w-xs text-sm font-semibold leading-6 opacity-80">{game.description}</p>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-current/15 pt-4">
              <span className="rounded-full bg-white/60 px-3 py-1.5 text-[11px] font-black">{game.detail}</span>
              <span className="inline-flex items-center gap-1 text-sm font-black">Play now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </div>
          </div>
        </Link>)}
      </div>
      <p className="relative mt-6 flex items-center justify-center gap-2 text-center text-xs font-bold text-indigo-200"><Gamepad2 className="h-4 w-4"/> No accounts • No pressure • Just creativity</p>
    </section>
  );
}
