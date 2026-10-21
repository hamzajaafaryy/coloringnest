import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buildNameSheet } from "@/lib/name-coloring";

export default function NameColoringTeaser() {
  const svg = buildNameSheet({ name: "SARA", theme: "butterflies", paper: "letter", tracing: false });
  return <div className="relative grid items-center gap-4 overflow-hidden rounded-[2.2rem] border border-[#e8d7f0] bg-[#f2e8fb] px-7 py-9 sm:grid-cols-[1fr_.65fr] sm:px-8 sm:py-10">
    <div className="relative z-10">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#7b41ae]"><Sparkles aria-hidden="true" className="h-3.5 w-3.5" /> A page with your name on it</span>
      <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-[#4c2f69]">Your name.<br />Your colors.</h2>
      <p className="mt-3 max-w-sm text-sm leading-7 text-[#775c89]">Big bubble letters, little decorations, and a name that makes it yours. Create a free page to print or color online.</p>
      <Link href="/name-coloring/" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#7741b2] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#613095]">Create My Name <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
    </div>
    <div aria-hidden="true" className="pointer-events-none hidden rotate-[7deg] overflow-hidden rounded-lg bg-white shadow-[0_12px_25px_rgba(85,49,113,.16)] sm:block [&>svg]:block [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
  </div>;
}
