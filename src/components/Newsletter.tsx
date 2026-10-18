import Link from "next/link";
import { MailOpen, Heart, ArrowRight } from "lucide-react";

/** A genuine content-discovery call to action, not a misleading signup form. */
export default function Newsletter() {
  return (
    <section className="relative my-12 overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-800 via-indigo-800 to-fuchsia-800 px-7 py-10 text-white shadow-xl sm:px-12 sm:py-14">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-pink-400/20 blur-3xl" />
      <div className="relative mx-auto max-w-2xl text-center">
        <MailOpen className="mx-auto h-9 w-9 text-yellow-300" aria-hidden="true" />
        <h2 className="mt-4 text-3xl font-black tracking-tight">A fresh idea whenever you need one</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-violet-100">
          Browse new printable sheets, or keep the designs you love in your personal favorites collection.
          No account, email address, or download required.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/printable-coloring-pages/" className="cc-btn bg-yellow-300 text-slate-950 hover:bg-yellow-200">
            Explore free printables <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/favorites/" className="cc-btn border border-white/30 bg-white/10 text-white hover:bg-white/20">
            <Heart className="h-4 w-4" /> My favorites
          </Link>
        </div>
      </div>
    </section>
  );
}
