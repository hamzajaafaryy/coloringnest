"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Home,
  Menu,
  Palette,
  Printer,
  Search,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import SearchBar from "./SearchBar";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/coloring-pages/", label: "Coloring Pages", icon: Palette },
  { href: "/color-online/", label: "Color Online", icon: WandSparkles },
  { href: "/printable-coloring-pages/", label: "Printables", icon: Printer },
  { href: "/blog/", label: "Ideas", icon: BookOpen },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMobilePanels = () => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5dfd1] bg-[#fffdf7]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] items-center justify-between gap-2 sm:min-h-20">
          <Link
            href="/"
            onClick={closeMobilePanels}
            className="group flex min-w-0 items-center gap-2.5 sm:shrink-0 rounded-2xl focus:outline-none"
            aria-label="CraftColoring home"
          >
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2874cc] text-white shadow-[3px_3px_0_#20334c] transition group-hover:-rotate-3">
              <Palette className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-yellow-300 ring-[3px] ring-white" />
            </span>
            <span className="min-w-0 leading-none">
              <span className="block truncate text-lg font-black tracking-tight text-slate-950 sm:text-2xl">
                Craft<span className="text-blue-600">Coloring</span>
              </span>
              <span className="mt-1 hidden text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 sm:block">
                Pick • Color • Smile
              </span>
            </span>
          </Link>

          <nav className="hidden shrink-0 items-center gap-1 lg:flex" aria-label="Main navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-black transition-all ${isActive(link.href) ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden min-w-0 items-center gap-2 xl:flex xl:w-[16rem]">
            <div className="min-w-0 flex-1">
              <SearchBar size="sm" placeholder="Find a picture…" />
            </div>
            <Link
              href="/color-online/"
              className="cc-btn cc-btn-primary min-h-11 shrink-0 px-4 py-2 text-xs"
            >
              <Sparkles className="h-4 w-4" />
              Play
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen((open) => !open);
                setMobileMenuOpen(false);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              aria-label="Search coloring pages"
              aria-expanded={mobileSearchOpen}
            >
              {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((open) => !open);
                setMobileSearchOpen(false);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="border-t border-blue-100 py-3 lg:hidden">
            <SearchBar placeholder="What do you want to color?" size="md" />
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-blue-100 bg-white px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-xl sm:px-6 lg:hidden">
          <nav className="mx-auto grid max-w-2xl grid-cols-2 gap-2" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobilePanels}
                  className={`flex min-h-[76px] flex-col items-start justify-center rounded-2xl border p-3 transition active:scale-[.98] ${isActive(link.href) ? "border-blue-200 bg-blue-100 text-blue-800" : "border-slate-100 bg-slate-50 text-slate-700"}`}
                >
                  <Icon className="mb-1.5 h-5 w-5" />
                  <span className="text-sm font-black">{link.label}</span>
                </Link>
              );
            })}
            <Link
              href="/color-online/"
              onClick={closeMobilePanels}
              className="col-span-2 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#2874cc] px-4 text-sm font-black text-white shadow-lg shadow-blue-100"
            >
              <Sparkles className="h-5 w-5" />
              Start coloring now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
