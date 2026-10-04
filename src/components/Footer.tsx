import Link from "next/link";
import { Heart, Palette, Sparkles } from "lucide-react";
import { getAllPublishedCategories } from "@/db/queries";

export default async function Footer() {
  const categories = await getAllPublishedCategories();
  const topCategories = categories.filter((category) => category.featured || category.popular).slice(0, 8);

  return (
    <footer className="relative mt-10 overflow-hidden border-t border-violet-100 bg-[#fbf8ff]">
      <div className="pointer-events-none absolute -left-20 top-8 h-40 w-40 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 p-[1px] shadow-xl shadow-violet-100">
          <div className="rounded-[calc(2rem-1px)] bg-white/95 px-6 py-7 backdrop-blur sm:flex sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600"><Palette className="h-6 w-6" /></span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-500">Your next creative break</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">Pick a page. Pick a color. Make it yours.</h2>
              </div>
            </div>
            <Link href="/coloring-pages/" className="cc-btn cc-btn-dark mt-5 w-full shrink-0 px-4 py-3 text-xs sm:mt-0 sm:w-auto sm:text-sm">
              Explore coloring pages <Sparkles className="h-4 w-4 text-yellow-300" />
            </Link>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400 text-white shadow-md"><Palette className="h-5 w-5" /></span>
              <span className="text-2xl font-black tracking-tight text-slate-900">Craft<span className="text-violet-600">Coloring</span></span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">A playful creative space for kids, families, teachers and adults to color, explore and make something joyful.</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-100">
              Made with <Heart className="h-3.5 w-3.5 fill-pink-400 text-pink-400" /> for creative minds
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-violet-600">Popular themes</h2>
            <ul className="space-y-2.5">
              {topCategories.map((category) => <li key={category.id}><Link href={`/coloring-pages/${category.slug}/`} className="cc-safe-wrap text-sm font-medium text-slate-600 transition hover:pl-1 hover:text-violet-700">{category.name}</Link></li>)}
              <li><Link href="/coloring-pages/" className="text-sm font-black text-violet-600">See all themes →</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-sky-600">Create</h2>
            <ul className="space-y-2.5">
              <li><Link href="/coloring-pages/" className="text-sm font-medium text-slate-600 hover:text-violet-700">Coloring Pages</Link></li>
              <li><Link href="/color-online/" className="text-sm font-medium text-slate-600 hover:text-violet-700">Color Online</Link></li>
              <li><Link href="/printable-coloring-pages/" className="text-sm font-medium text-slate-600 hover:text-violet-700">Printable Pages</Link></li>
              <li><Link href="/colorquest/" className="text-sm font-medium text-slate-600 hover:text-violet-700">ColorQuest Storybook</Link></li>
              <li><Link href="/blog/" className="text-sm font-medium text-slate-600 hover:text-violet-700">Creative Blog</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-orange-500">CraftColoring</h2>
            <ul className="space-y-2.5">
              <li><Link href="/about/" className="text-sm font-medium text-slate-600 hover:text-violet-700">About</Link></li>
              <li><Link href="/contact/" className="text-sm font-medium text-slate-600 hover:text-violet-700">Contact</Link></li>
              <li><Link href="/privacy-policy/" className="text-sm font-medium text-slate-600 hover:text-violet-700">Privacy Policy</Link></li>
              <li><Link href="/terms/" className="text-sm font-medium text-slate-600 hover:text-violet-700">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-violet-100 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CraftColoring. All rights reserved.</p>
          <p className="font-semibold">Free Online Coloring Pages • Create • Color • Smile</p>
        </div>
      </div>
    </footer>
  );
}
