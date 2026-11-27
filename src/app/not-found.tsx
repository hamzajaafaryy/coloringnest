import Link from "next/link";
import { ArrowRight, Heart, Palette, Printer, Shuffle } from "lucide-react";

const choices = [
  {
    title: "Browse coloring pages",
    description: "Find a printable design by theme.",
    href: "/coloring-pages/",
    icon: Palette,
    color: "bg-[#e7deff] text-[#2b2140]",
  },
  {
    title: "Printable sheets",
    description: "Explore free artwork to print at home.",
    href: "/printable-coloring-pages/",
    icon: Printer,
    color: "bg-[#fff3d6] text-[#2b2140]",
  },
  {
    title: "Surprise me",
    description: "Discover a random coloring page.",
    href: "/surprise-me/",
    icon: Shuffle,
    color: "bg-[#e8f4ff] text-[#2b2140]",
  },
  {
    title: "My favorites",
    description: "Revisit saved coloring pages.",
    href: "/favorites/",
    icon: Heart,
    color: "bg-[#ffdae2] text-[#2b2140]",
  },
];

/**
 * Not-found is rendered as part of static page generation, too.
 * Keep it database-independent so Preview builds don't need live DB access.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6">
      <div className="rounded-full border-2 border-[#2b2140] bg-[#ffd23f] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.15em] text-[#2b2140] shadow-[3px_3px_0_#2b2140]">
        Page not found
      </div>
      <p className="mt-5 text-7xl font-black text-[#8b5cf6] sm:text-8xl" aria-hidden="true">
        404
      </p>
      <h1 className="mt-5 text-3xl font-black tracking-tight text-[#2b2140] sm:text-5xl">
        This page has wandered off the canvas.
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-[#514461]">
        The coloring page you are looking for may have moved. There are plenty
        of new creative adventures waiting for you.
      </p>
      <Link href="/" className="cc-btn cc-btn-primary mt-7">
        Back to CraftColoring <ArrowRight className="h-4 w-4" />
      </Link>

      <section className="mt-12 w-full" aria-label="Explore CraftColoring">
        <h2 className="mb-5 text-lg font-extrabold text-[#2b2140]">Try one of these instead</h2>
        <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
          {choices.map(({ title, description, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="group flex min-h-24 items-center gap-4 rounded-2xl border-2 border-[#2b2140] bg-white p-5 shadow-[4px_4px_0_rgba(43,33,64,0.14)] transition hover:-translate-y-0.5 hover:bg-[#fff3d6] hover:shadow-[6px_6px_0_rgba(43,33,64,0.16)]"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color}`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block text-base font-extrabold text-[#2b2140]">{title}</span>
                <span className="mt-1 block text-sm text-[#514461]">{description}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-[#514461] transition group-hover:translate-x-1 group-hover:text-[#2b2140]" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
