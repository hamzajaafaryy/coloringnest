import Link from "next/link";
import { ArrowRight, Heart, Palette, Printer, Shuffle } from "lucide-react";

const choices = [
  {
    title: "Browse coloring pages",
    description: "Find a printable design by theme.",
    href: "/coloring-pages/",
    icon: Palette,
    color: "bg-violet-100 text-violet-700",
  },
  {
    title: "Printable sheets",
    description: "Explore free artwork to print at home.",
    href: "/printable-coloring-pages/",
    icon: Printer,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Surprise me",
    description: "Discover a random coloring page.",
    href: "/surprise-me/",
    icon: Shuffle,
    color: "bg-sky-100 text-sky-700",
  },
  {
    title: "My favorites",
    description: "Revisit saved coloring pages.",
    href: "/favorites/",
    icon: Heart,
    color: "bg-pink-100 text-pink-700",
  },
];

/**
 * Not-found is rendered as part of static page generation, too.
 * Keep it database-independent so Preview builds don't need live DB access.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6">
      <div className="rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.15em] text-violet-700">
        Page not found
      </div>
      <p className="mt-5 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-400 bg-clip-text text-7xl font-black text-transparent sm:text-8xl" aria-hidden="true">
        404
      </p>
      <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
        This page has wandered off the canvas.
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
        The coloring page you are looking for may have moved. There are plenty
        of new creative adventures waiting for you.
      </p>
      <Link href="/" className="cc-btn cc-btn-primary mt-7">
        Back to CraftColoring <ArrowRight className="h-4 w-4" />
      </Link>

      <section className="mt-12 w-full" aria-label="Explore CraftColoring">
        <h2 className="mb-5 text-lg font-extrabold text-slate-900">Try one of these instead</h2>
        <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          {choices.map(({ title, description, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block text-base font-extrabold text-slate-900">{title}</span>
                <span className="mt-1 block text-sm text-slate-600">{description}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-violet-700" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
