import Link from "next/link";
import { ArrowRight, Gamepad2, Sparkles } from "lucide-react";
import GameIllustration from "@/components/play/GameIllustration";
import CartoonCharacter from "@/components/play/CartoonCharacters";

const games = [
  { id:"cartoon" as const, title:"Cartoon Coloring", description:"Color four adorable characters: a kitten, unicorn, dinosaur and bunny.", detail:"4 storybook friends", gradient:"from-[#fbd2e6] to-[#ffdea6]", dark:"text-rose-950" },
  { id:"colors" as const, title:"Rainbow Quest", description:"Discover colors by matching them with familiar things in a magical rainbow world.", detail:"Color challenges", gradient:"from-[#ffe0a9] to-[#9febdc]", dark:"text-emerald-950" },
  { id:"memory" as const, title:"Memory Garden", description:"Find matching cartoon friends with three levels from Easy to Expert.", detail:"3 difficulty levels", gradient:"from-[#c3b4ff] to-[#a0e6ff]", dark:"text-violet-950" },
  { id:"doodle" as const, title:"Doodle Studio", description:"Draw on a free canvas, add stickers, use brushes and save your masterpiece.", detail:"Free drawing studio", gradient:"from-[#ffe8a5] to-[#a8e8cf]", dark:"text-emerald-950" },
  { id:"numbers" as const, title:"Pixel Art Club", description:"Follow the numbers and uncover adorable pixel pictures one square at a time.", detail:"Color-by-number art", gradient:"from-[#9bdcf8] to-[#ecc0fb]", dark:"text-indigo-950" },
];

export default function HomePlayGames() {
  return (
    <section aria-labelledby="playzone-home-title" className="relative overflow-hidden rounded-[1.75rem] bg-[#24184f] px-4 py-8 text-white shadow-[0_22px_70px_rgba(37,24,96,.16)] sm:rounded-[2.7rem] sm:px-9 sm:py-12 lg:px-12">
      <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-pink-500/25 blur-3xl"/>
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl"/>
      <div className="relative mb-7 flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-300 px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-slate-950"><Sparkles className="h-4 w-4"/> Kids art &amp; games</span>
          <h2 id="playzone-home-title" className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">A world of <span className="text-yellow-300">cartoon creativity.</span></h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">Interactive coloring, friendly cartoon characters, memory challenges and an art studio. Free to explore on any device.</p>
        </div>
        <Link href="/play/" className="cc-btn border border-white/30 bg-white px-5 py-3 font-black text-violet-800 hover:bg-yellow-100">Explore the play zone <ArrowRight className="h-5 w-5"/></Link>
      </div>
      <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {games.map((game,index)=>(
          <Link key={game.id} href={`/play/#${game.id}`} className={`group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-[1.6rem] bg-gradient-to-br ${game.gradient} p-4 shadow-lg transition duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-yellow-300 sm:min-h-[360px] sm:p-5 ${game.dark}`}>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide">Adventure {String(index+1).padStart(2,"0")}</span>
              <ArrowRight className="h-5 w-5"/>
            </div>
            {game.id === "cartoon" ? <CartoonCharacter id="kitty" interactive={false} className="mx-auto aspect-[4/3] w-full max-w-[260px] transition-transform duration-300 group-hover:scale-105"/> : <GameIllustration variant={game.id} className="mx-auto aspect-[4/3] w-full max-w-[260px] transition-transform duration-300 group-hover:scale-105"/>}
            <div>
              <h3 className="text-xl font-black sm:text-2xl">{game.title}</h3>
              <p className="mt-1.5 max-w-md text-sm font-semibold leading-6 opacity-80">{game.description}</p>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-current/15 pt-3">
                <span className="rounded-full bg-white/60 px-3 py-1.5 text-[11px] font-black">{game.detail}</span>
                <span className="text-sm font-black">Play now →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className="relative mt-6 flex items-center justify-center gap-2 text-center text-xs font-bold text-indigo-200"><Gamepad2 className="h-4 w-4"/> No account • No pressure • Creative fun</p>
    </section>
  );
}
