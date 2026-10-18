import { Heart, Sparkles, Star } from "lucide-react";

export default function HeroArtwork() {
  return (
    <div className="relative mx-auto aspect-[1.05/1] w-full max-w-[570px]">
      <div className="absolute inset-[8%_5%_3%_5%] rotate-[-6deg] rounded-[3rem] border-[8px] border-white bg-gradient-to-br from-sky-300 via-indigo-200 to-pink-300 shadow-[0_35px_80px_rgba(67,56,202,.22)]" />
      <div className="absolute inset-[11%_6%_6%_5%] rotate-[4deg] rounded-[3rem] bg-yellow-200/90" />
      <div className="absolute inset-[8%_7%_4%_7%] overflow-hidden rounded-[2.6rem] border-[6px] border-white/80 bg-gradient-to-b from-[#d6f2ff] via-[#fff4ff] to-[#fff0cb] shadow-2xl">
        <svg viewBox="0 0 560 490" className="h-full w-full" role="img" aria-label="A cheerful friendly magical creature surrounded by a rainbow, stars and colorful crayons">
          <defs>
            <linearGradient id="monster" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#a7f3d0"/><stop offset="1" stopColor="#5eead4"/></linearGradient>
            <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#fffefa"/></linearGradient>
          </defs>
          <circle cx="470" cy="78" r="46" fill="#fde68a" opacity=".9" />
          <path d="M-45 310 Q90 80 280 295" fill="none" stroke="#fda4af" strokeWidth="34" strokeLinecap="round" opacity=".9" />
          <path d="M-18 311 Q103 134 245 296" fill="none" stroke="#fbbf24" strokeWidth="27" strokeLinecap="round" opacity=".9" />
          <path d="M11 314 Q103 195 210 297" fill="none" stroke="#93c5fd" strokeWidth="22" strokeLinecap="round" opacity=".95" />
          <g fill="#fff" opacity=".95"><ellipse cx="70" cy="78" rx="58" ry="22"/><circle cx="42" cy="66" r="24"/><circle cx="72" cy="54" r="30"/><ellipse cx="431" cy="167" rx="67" ry="20"/><circle cx="402" cy="154" r="24"/><circle cx="441" cy="147" r="30"/></g>
          <g transform="translate(126 91) rotate(-5 154 158)">
            <rect x="6" y="17" width="316" height="325" rx="29" fill="#7c3aed" opacity=".15"/>
            <rect x="0" y="0" width="316" height="325" rx="29" fill="url(#paper)" stroke="#ffffff" strokeWidth="10"/>
            <path d="M74 214 C13 192 24 122 67 147" fill="none" stroke="#5eead4" strokeWidth="28" strokeLinecap="round"/>
            <path d="M242 211 C294 179 287 120 246 152" fill="none" stroke="#5eead4" strokeWidth="28" strokeLinecap="round"/>
            <path d="M82 92 Q54 19 113 44 Q146 70 154 65 Q192 18 239 41 Q257 56 238 99 Q258 132 253 182 Q260 270 161 280 Q56 269 63 185 Q62 127 82 92Z" fill="url(#monster)" stroke="#164e63" strokeWidth="9" strokeLinejoin="round"/>
            <path d="M131 55 L162 -5 L186 60" fill="#fde68a" stroke="#164e63" strokeWidth="8" strokeLinejoin="round"/>
            <ellipse cx="118" cy="146" rx="11" ry="17" fill="#164e63"/>
            <ellipse cx="209" cy="146" rx="11" ry="17" fill="#164e63"/>
            <circle cx="122" cy="140" r="4" fill="#fff"/><circle cx="212" cy="140" r="4" fill="#fff"/>
            <circle cx="90" cy="178" r="18" fill="#fda4af" opacity=".78"/><circle cx="238" cy="178" r="18" fill="#fda4af" opacity=".78"/>
            <path d="M135 181 Q162 217 195 182" fill="none" stroke="#164e63" strokeWidth="9" strokeLinecap="round"/>
            <path d="M120 255 L98 287 M202 257 L227 286" stroke="#164e63" strokeWidth="9" strokeLinecap="round"/>
            <g transform="translate(231 33)"><path d="M0 -21L6 -5 23 0 6 5 0 21 -6 5 -23 0 -6 -5Z" fill="#fbbf24"/></g>
            <g transform="translate(64 259)"><path d="M0 -15L4 -4 16 0 4 4 0 15 -4 4 -16 0 -4 -4Z" fill="#ec4899"/></g>
            <text x="157" y="307" textAnchor="middle" fontSize="17" fontWeight="800" fill="#7c3aed">YOU ARE AN ARTIST!</text>
          </g>
          <g transform="translate(25 364) rotate(-15)">
            <rect width="26" height="134" rx="9" fill="#f472b6" stroke="#fff" strokeWidth="3"/>
            <path d="M0 17 L13 -4 L26 17Z" fill="#fef3c7"/>
            <path d="M8 5L13 -4 18 5Z" fill="#334155"/>
          </g>
          <g transform="translate(472 347) rotate(20)">
            <rect width="28" height="135" rx="10" fill="#8b5cf6" stroke="#fff" strokeWidth="3"/>
            <path d="M0 17 L14 -7 L28 17Z" fill="#fef3c7"/>
            <path d="M8 5L14 -7 20 5Z" fill="#334155"/>
          </g>
          <g fill="#f59e0b"><path d="M480 260 L486 277 504 280 487 288 481 307 473 290 455 284 473 278Z"/><path d="M55 199 L61 213 77 219 62 223 54 239 48 223 32 216 48 211Z"/></g>
        </svg>
      </div>
      <div className="cc-float absolute -left-1 top-[22%] rounded-2xl border-2 border-white bg-yellow-300 px-4 py-3 shadow-xl sm:-left-5">
        <span className="text-xl" aria-hidden="true">⭐</span><span className="ml-1 text-xs font-black text-slate-900">Collect stars</span>
      </div>
      <div className="cc-float-reverse absolute -right-1 bottom-[21%] flex items-center gap-2 rounded-2xl border-2 border-white bg-white px-4 py-3 shadow-xl sm:-right-4">
        <span className="text-2xl" aria-hidden="true">🖍️</span><span className="text-xs font-black text-violet-700">Make magic!</span>
      </div>
      <span className="cc-bounce-soft absolute right-[14%] top-[1%] rounded-full bg-white p-3 text-yellow-400 shadow-xl"><Star className="h-7 w-7 fill-current" /></span>
      <span className="cc-float absolute bottom-0 left-[21%] rounded-full bg-white p-3 text-pink-400 shadow-lg"><Heart className="h-5 w-5 fill-current" /></span>
      <span className="absolute -left-2 bottom-16 text-sky-500"><Sparkles className="h-7 w-7" /></span>
    </div>
  );
}
