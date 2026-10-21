"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Palette, Printer, Search, Sparkles, X } from "lucide-react";
import SearchBar from "@/components/SearchBar";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/coloring-pages/", label: "Coloring Pages" },
  { href: "/printable-coloring-pages/", label: "Printables" },
  { href: "/name-coloring/", label: "Name Coloring" },
  { href: "/blog/", label: "Coloring Tips" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const active = (href: string) => {
    const path = href.replace(/\/$/, "");
    return href === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#eee6f5] bg-white/95 shadow-[0_6px_25px_rgba(53,33,74,0.045)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[76px] items-center justify-between gap-3 xl:min-h-[88px]">
          <Link
            href="/"
            onClick={() => { setMenuOpen(false); setSearchOpen(false); }}
            className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
            aria-label="CraftColoring home"
          >
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] bg-gradient-to-br from-[#a05de2] via-[#d96eb8] to-[#ffb362] text-white shadow-[0_7px_18px_rgba(143,73,186,0.22)] transition group-hover:-rotate-6">
              <Palette className="h-6 w-6" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#ffe68e]" />
            </span>
            <span className="block leading-none">
              <span className="block text-[1.22rem] font-black tracking-tight text-[#392653] sm:text-[1.5rem]">
                Craft<span className="text-[#9255cb]">Coloring</span>
              </span>
              <span className="mt-1 hidden text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#8b789d] sm:block">
                Little art, big smiles
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active(link.href) ? "page" : undefined}
                className={
                  "rounded-full px-4 py-2.5 text-sm font-extrabold transition " +
                  (active(link.href)
                    ? "bg-[#f1e7fb] text-[#7840b5]"
                    : "text-[#695b76] hover:bg-[#f7f0fc] hover:text-[#7946ad]")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden w-56 2xl:block">
              <SearchBar size="sm" placeholder="Search a picture..." />
            </div>
            <Link
              href="/printable-coloring-pages/"
              className="hidden min-h-11 items-center gap-2 rounded-full bg-[#8147c8] px-5 py-2 text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(128,70,203,0.18)] transition hover:bg-[#6c32b3] xl:inline-flex"
            >
              <Printer className="h-4 w-4" /> Print &amp; color <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              aria-label="Search coloring pages"
              aria-controls="header-search-panel"
              aria-expanded={searchOpen}
              onClick={() => { setSearchOpen((old) => !old); setMenuOpen(false); }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eee2f4] bg-white text-[#72459d] transition hover:bg-[#f8efff] 2xl:hidden"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-controls="mobile-site-navigation"
              aria-expanded={menuOpen}
              onClick={() => { setMenuOpen((old) => !old); setSearchOpen(false); }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5eafa] text-[#704299] transition hover:bg-[#ecd7f8] xl:hidden"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div id="header-search-panel" className="border-t border-[#f0e6f6] pb-4 pt-3 2xl:hidden">
            <SearchBar size="md" placeholder="Search unicorns, cats, dinosaurs..." />
          </div>
        )}
      </div>

      {menuOpen && (
        <div id="mobile-site-navigation" className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-[#f0e6f6] bg-white px-4 pb-6 pt-3 shadow-xl sm:px-6 xl:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto grid max-w-7xl gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active(link.href) ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={
                  "rounded-xl px-4 py-3.5 text-sm font-extrabold " +
                  (active(link.href) ? "bg-[#f1e7fb] text-[#7840b5]" : "text-[#554369] hover:bg-[#fbf5ff]")
                }
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/coloring-pages/"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#8147c8] px-4 py-3.5 font-extrabold text-white"
            >
              <Sparkles className="h-4 w-4" /> Start coloring <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
