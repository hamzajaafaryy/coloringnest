import Link from "next/link";
import { Palette, Heart, ShieldCheck, Sparkles, Printer } from "lucide-react";
import { CATEGORIES } from "@/lib/data/categories";

export default function Footer() {
  const topCategories = CATEGORIES.slice(0, 8);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white">
                <Palette className="w-5 h-5" />
              </div>
              <span className="font-bold text-2xl text-white tracking-tight">
                Coloring<span className="text-indigo-400">Nest</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Free printable and online coloring pages for kids, toddlers, preschoolers, and adults. Designed with high quality, vector line art for creative fun, learning, and stress relief.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Free & Safe
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                <Sparkles className="w-4 h-4 text-amber-400" />
                No Account Needed
              </span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Top Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {topCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/coloring-pages/${cat.slug}/`}
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Special Hubs */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Explore Hubs
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/printable-coloring-pages/" className="hover:text-indigo-400 transition-colors">
                  Printable Coloring Pages
                </Link>
              </li>
              <li>
                <Link href="/free-coloring-pages/" className="hover:text-indigo-400 transition-colors">
                  Free Coloring Pages
                </Link>
              </li>
              <li>
                <Link href="/coloring-pages/preschool/" className="hover:text-indigo-400 transition-colors">
                  Preschool & Toddlers
                </Link>
              </li>
              <li>
                <Link href="/coloring-pages/kindergarten/" className="hover:text-indigo-400 transition-colors">
                  Kindergarten Sheets
                </Link>
              </li>
              <li>
                <Link href="/coloring-pages/adults/" className="hover:text-indigo-400 transition-colors">
                  Adults & Stress Relief
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="hover:text-indigo-400 transition-colors">
                  Coloring Guides & Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              About & Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about/" className="hover:text-indigo-400 transition-colors">
                  About ColoringNest
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="hover:text-indigo-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy/" className="hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms/" className="hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ColoringNest. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for creative kids and families worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
