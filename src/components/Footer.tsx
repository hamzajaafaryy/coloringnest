import Link from "next/link";
import { ArrowRight, Heart, Palette, Printer, Sparkles } from "lucide-react";

const links = [
  { label: "All coloring pages", href: "/coloring-pages/" },
  { label: "Printable pictures", href: "/printable-coloring-pages/" },
  { label: "Name coloring", href: "/name-coloring/" },
  { label: "Coloring tips", href: "/blog/" },
  { label: "Color online", href: "/color-online/" },
];

const info = [
  { label: "Our story", href: "/about/" },
  { label: "Contact", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Terms of Use", href: "/terms/" },
];

export default function Footer() {
  return (
    <footer className="mt-0 overflow-hidden border-t-2 border-[#2b2140] bg-[#4c3176] text-white">
      <div className="h-3 bg-[linear-gradient(90deg,#ff5d73_0_16.66%,#ff9f1c_16.66%_33.33%,#ffd23f_33.33%_50%,#3ecf8e_50%_66.66%,#3aa8ff_66.66%_83.33%,#8b5cf6_83.33%)]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
        <div className="grid gap-11 pb-12 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-20">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 rounded-xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#2b2140] bg-[#ffd23f] text-[#2b2140] shadow-[4px_4px_0_#2b2140]"><Palette className="h-6 w-6" /></span>
              <span className="text-2xl font-black tracking-tight">
                Craft<span className="text-[#ffd23f]">Coloring</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#d7cce6]">
              A cheerful place to find pictures, pick up your crayons, and make a little art together. Browse free coloring pages for kids, families, and classrooms.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#fff0cf]">
              <Heart className="h-4 w-4 fill-[#ff7ab8] text-[#ff7ab8]" /> Made for colorful moments
            </div>
          </div>

          <nav aria-label="Explore CraftColoring">
            <h2 className="text-sm font-black tracking-wide text-white">Explore</h2>
            <ul className="mt-5 space-y-3">
              {links.map((item) => (
                <li key={item.href}>
                  <Link className="inline-flex items-center gap-2 text-sm text-[#d7cce6] transition hover:translate-x-1 hover:text-white" href={item.href}>
                    <ArrowRight className="h-3.5 w-3.5 text-[#ffcb90]" /> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site information">
            <h2 className="text-sm font-black tracking-wide text-white">Information</h2>
            <ul className="mt-5 space-y-3">
              {info.map((item) => (
                <li key={item.href}>
                  <Link className="inline-flex items-center gap-2 text-sm text-[#d7cce6] transition hover:translate-x-1 hover:text-white" href={item.href}>
                    <ArrowRight className="h-3.5 w-3.5 text-[#ffcb90]" /> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-7 text-xs text-[#cbbfdd]">
          <p>© {new Date().getFullYear()} CraftColoring. All rights reserved.</p>
          <p className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#ffd38b]" /> A little art goes a long way.</p>
        </div>
      </div>
    </footer>
  );
}
