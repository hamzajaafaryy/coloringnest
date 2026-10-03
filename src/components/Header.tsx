"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Palette, Search, Menu, X, Sparkles, Wand2 } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/coloring-pages/", label: "Coloring Pages" },
    { href: "/printable-coloring-pages/", label: "Printables" },
    { href: "/blog/", label: "Blog" },
  ];

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/80 bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(124,58,237,0.06)]">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex min-h-[68px] items-center justify-between gap-2 sm:min-h-20">
          <Link href="/" className="group flex min-w-0 items-center gap-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-400">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400 text-white shadow-lg shadow-violet-200 transition duration-300 group-hover:-rotate-3 group-hover:scale-105 sm:h-11 sm:w-11">
              <Palette className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-yellow-300 ring-2 ring-white animate-pulse" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-black tracking-tight text-slate-900 sm:text-2xl">Craft<span className="text-violet-600">Coloring</span></span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-violet-400 sm:block">Create • Color • Smile</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${isActive(link.href) ? "bg-violet-100 text-violet-700 shadow-sm" : "text-slate-600 hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700"}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden min-w-0 items-center gap-2 xl:flex xl:w-[24rem]">
            <div className="min-w-0 flex-1"><SearchBar size="sm" /></div>
            <Link href="/color-online/unicorn-rainbow-coloring-page/" className="cc-btn cc-btn-primary shrink-0 px-4 py-2.5 text-xs">
              <Wand2 className="h-4 w-4" /> Color
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="rounded-xl p-2.5 text-slate-600 hover:bg-violet-50 hover:text-violet-700" aria-label="Toggle Search">
              <Search className="h-5 w-5" />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-xl p-2.5 text-slate-600 hover:bg-violet-50 hover:text-violet-700" aria-label="Toggle Menu">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileSearchOpen && <div className="border-t border-violet-100 py-3 lg:hidden"><SearchBar size="md" /></div>}
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-violet-100 bg-white px-3 pb-5 pt-3 shadow-xl sm:px-6 lg:hidden">
          <nav className="grid gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`rounded-2xl px-4 py-3.5 text-sm font-bold ${isActive(link.href) ? "bg-violet-100 text-violet-700" : "text-slate-700 hover:bg-violet-50"}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 sm:grid-cols-2">
            <Link href="/printable-coloring-pages/" onClick={() => setMobileMenuOpen(false)} className="cc-btn cc-btn-soft w-full">
              <Palette className="h-4 w-4" /> Printables
            </Link>
            <Link href="/color-online/unicorn-rainbow-coloring-page/" onClick={() => setMobileMenuOpen(false)} className="cc-btn cc-btn-primary w-full">
              <Sparkles className="h-4 w-4" /> Color Online
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}