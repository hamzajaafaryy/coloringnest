import type { SVGProps } from "react";

type Variant = "cartoon" | "colors" | "memory" | "doodle" | "numbers";

export default function GameIllustration({ variant, className = "" }: { variant: Variant; className?: string }) {
  return (
    <svg viewBox="0 0 320 235" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`Cartoon illustration for ${variant} game`} className={className}>
      <defs>
        <linearGradient id={`bubble-${variant}`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff" stopOpacity=".85"/><stop offset="1" stopColor="#fff" stopOpacity=".12"/></linearGradient>
        <filter id={`shadow-${variant}`}><feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#403069" floodOpacity=".13"/></filter>
      </defs>
      <circle cx="151" cy="122" r="104" fill={`url(#bubble-${variant})`} />
      <g fill="#fff" opacity=".95"><circle cx="46" cy="55" r="5"/><circle cx="277" cy="35" r="7"/><circle cx="272" cy="192" r="5"/></g>
      {variant === "cartoon" && <g stroke="#4b3769" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" filter={`url(#shadow-${variant})`}>
        <path d="M113 95 L105 30 L157 72 L195 31 L207 98" fill="#ffdccb"/>
        <path d="M124 69 L117 48 L143 70 M177 70 L193 49 L194 76" fill="#f99fbb" strokeWidth="3"/>
        <path d="M99 106 Q111 66 165 72 Q226 72 233 124 Q234 173 180 184 Q126 194 96 159 Q81 131 99 106 Z" fill="#fff8e9"/>
        <ellipse cx="133" cy="122" rx="7" ry="10" fill="#3e3060" stroke="none"/><ellipse cx="195" cy="121" rx="7" ry="10" fill="#3e3060" stroke="none"/>
        <path d="M157 143 L168 148 L178 143 L168 138 Z" fill="#fc94b1" strokeWidth="3"/>
        <path d="M168 148 Q152 165 140 150 M168 148 Q185 165 199 150" fill="none" strokeWidth="3"/>
        <ellipse cx="119" cy="146" rx="14" ry="7" fill="#ffc6d4" stroke="none"/><ellipse cx="210" cy="146" rx="14" ry="7" fill="#ffc6d4" stroke="none"/>
        <path d="M126 186 Q158 165 194 186 L196 216 Q159 233 126 215 Z" fill="#a7e5d5"/>
        <path d="M147 185 L173 208 L190 184" fill="#e8feff" strokeWidth="3"/>
      </g>}
      {variant === "colors" && <g fill="none" strokeLinecap="round">
        <path d="M53 177 A100 100 0 0 1 253 177" stroke="#f97085" strokeWidth="17"/>
        <path d="M70 177 A83 83 0 0 1 236 177" stroke="#fbbf24" strokeWidth="16"/>
        <path d="M87 177 A66 66 0 0 1 219 177" stroke="#67d7af" strokeWidth="15"/>
        <path d="M104 177 A49 49 0 0 1 202 177" stroke="#84b9ff" strokeWidth="14"/>
        <g fill="#fff" stroke="none"><ellipse cx="52" cy="182" rx="40" ry="22"/><ellipse cx="85" cy="179" rx="38" ry="26"/><ellipse cx="232" cy="183" rx="43" ry="24"/><ellipse cx="266" cy="185" rx="33" ry="20"/></g>
        <g fill="#493861" stroke="none"><circle cx="44" cy="183" r="4"/><circle cx="72" cy="183" r="4"/><path d="M53 192 Q58 199 65 191" stroke="#493861" strokeWidth="2"/><circle cx="236" cy="184" r="4"/><circle cx="261" cy="184" r="4"/><path d="M244 194 Q249 200 255 192" stroke="#493861" strokeWidth="2"/></g>
      </g>}
      {variant === "memory" && <g stroke="#4b3769" strokeWidth="4" strokeLinejoin="round" filter={`url(#shadow-${variant})`}>
        <rect x="58" y="55" width="84" height="115" rx="16" fill="#fff1c1" transform="rotate(-14 100 110)"/>
        <rect x="175" y="55" width="84" height="115" rx="16" fill="#b0eae7" transform="rotate(14 215 112)"/>
        <rect x="115" y="78" width="93" height="124" rx="18" fill="#fff" />
        <path d="M161 137 C124 95 120 147 156 153 C144 185 182 174 169 148 C210 132 187 101 161 137 Z" fill="#b9a3fc" strokeWidth="3"/>
        <path d="M161 137 L161 172" fill="none" strokeWidth="3"/>
        <circle cx="154" cy="136" r="2" fill="#4b3769" stroke="none"/><circle cx="168" cy="136" r="2" fill="#4b3769" stroke="none"/>
        <path d="M158 145 Q162 148 166 145" strokeWidth="2" fill="none"/>
        <path d="M86 112 L94 132 L111 138 L94 145 L87 164 L79 145 L63 138 L80 131 Z" fill="#fbbf24" strokeWidth="2" transform="rotate(-14 100 110)"/>
        <circle cx="223" cy="126" r="20" fill="#fca5a5" strokeWidth="2"/>
      </g>}
      {variant === "doodle" && <g filter={`url(#shadow-${variant})`}>
        <rect x="69" y="45" width="179" height="158" rx="18" fill="#fff" stroke="#e0d4ff" strokeWidth="7" transform="rotate(-8 160 125)"/>
        <path d="M118 144 Q115 91 157 97 Q199 91 204 144" stroke="#7a62cf" strokeWidth="7" fill="none" strokeLinecap="round"/>
        <circle cx="136" cy="141" r="7" fill="#493861"/><circle cx="188" cy="141" r="7" fill="#493861"/>
        <path d="M147 158 Q164 171 181 154" stroke="#493861" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M224 46 L269 140 L252 164 L227 152 L191 67 Z" fill="#ffc958" stroke="#43345f" strokeWidth="4" transform="rotate(-23 224 100)"/>
        <path d="M252 164 L269 140 L272 174 Z" fill="#f6c3a4" stroke="#43345f" strokeWidth="3" transform="rotate(-23 224 100)"/>
      </g>}
      {variant === "numbers" && <g filter={`url(#shadow-${variant})`}>
        <rect x="69" y="34" width="184" height="174" rx="15" fill="#fff" stroke="#e1d6ff" strokeWidth="5"/>
        {Array.from({length:7},(_,row)=>Array.from({length:7},(_,col)=>{
          const colored = (row>=1 && row<=4 && ((col>=1 && col<=2)||(col>=4 && col<=5))) || (row===3 && col>=1 && col<=5) || (row===4 && col>=1 && col<=5) || (row===5 && col>=2 && col<=4) || (row===6 && col===3);
          return <rect key={`${row}-${col}`} x={88+col*21} y={47+row*21} width="19" height="19" rx="3" fill={colored?"#fb86a5":"#f1edfb"} />;
        }))}
        <path d="M252 40 L262 60 L281 63 L265 77 L269 96 L252 86 L235 95 L239 75 L224 61 L244 59 Z" fill="#ffdc68" stroke="#edb44c" strokeWidth="2"/>
      </g>}
      <g fill="#fff" opacity=".95"><path d="M33 126 l5 -13 l5 13 l13 5 l-13 5 l-5 13 l-5 -13 l-13 -5 Z"/><path d="M284 99 l4 -10 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 Z"/></g>
    </svg>
  );
}
