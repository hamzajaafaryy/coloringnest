type CategoryArtProps = { slug: string; name: string };
function categoryKind(slug: string) {
  const value = slug.toLowerCase();
  if (/unicorn|fantasy|fairy|princess/.test(value)) return "magic";
  if (/dino|dragon|reptile/.test(value)) return "dino";
  if (/animal|pet|cat|dog|toddler|preschool|kindergarten/.test(value)) return "cat";
  if (/ocean|sea|fish|underwater/.test(value)) return "ocean";
  if (/vehicle|car|transport|truck|sports/.test(value)) return "car";
  if (/outer|space|planet|rocket|astronaut/.test(value)) return "space";
  if (/flower|garden|nature|mandala|adult/.test(value)) return "flower";
  if (/holiday|christmas|easter|halloween|season/.test(value)) return "holiday";
  return "rainbow";
}
export default function CategoryArtwork({slug,name}:CategoryArtProps){
 const kind=categoryKind(slug);
 return (
  <svg viewBox="0 0 360 260" role="img" aria-label={`Illustration for ${name}`} className="h-full w-full transition-transform duration-300 group-hover:scale-105" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="180" cy="226" rx="133" ry="18" fill="#6f5aab" opacity=".13"/>
    <g fill="#ffffff" opacity=".6"><circle cx="43" cy="62" r="9"/><circle cx="305" cy="43" r="12"/><circle cx="324" cy="191" r="8"/></g>
    {kind==="magic"&&<g stroke="#443668" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M136 187 Q159 115 228 165 L230 220 H135 Z" fill="#f7fafc"/>
      <path d="M151 159 Q106 98 162 73 Q197 58 230 104 Q244 153 200 176 Z" fill="#fff"/>
      <path d="M173 83 L200 20 L211 94 Z" fill="#f2cc61"/>
      <path d="M201 92 Q246 76 231 132 Q223 151 207 158 Q222 109 197 122 Z" fill="#a88cf8"/>
      <path d="M162 101 Q150 70 117 75 Q131 107 162 116 Z" fill="#ffbdd7"/>
      <circle cx="184" cy="124" r="7" fill="#443668" stroke="none"/>
      <path d="M166 151 Q183 168 198 149" fill="none" strokeWidth="3"/>
      <path d="M128 199 L114 229 H151 L159 207 M206 210 L217 229 H244 L235 202" fill="#fff"/>
      <path d="M263 58 L271 75 L289 80 L273 88 L268 107 L258 89 L241 83 L258 75 Z" fill="#ffd362" stroke="none"/>
    </g>}
    {kind==="dino"&&<g stroke="#3b4267" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M217 191 Q272 166 284 128 Q291 208 231 216 Z" fill="#7ce1ab"/>
      <path d="M116 178 Q137 111 224 150 Q275 176 240 218 H136 Q99 218 116 178 Z" fill="#8ae7b8"/>
      <path d="M122 170 Q113 119 126 80 Q150 44 195 67 Q224 93 204 131 L170 173 Z" fill="#8ae7b8"/>
      <path d="M170 72 L183 38 L202 77 M216 152 L237 113 L254 164 M235 177 L265 149 L274 192" fill="#fcb96c"/>
      <ellipse cx="171" cy="101" rx="8" ry="10" fill="#3b4267" stroke="none"/>
      <path d="M139 125 Q161 144 183 126" fill="none" strokeWidth="3"/>
      <ellipse cx="150" cy="115" rx="12" ry="6" fill="#fb8fa7" stroke="none"/>
      <path d="M146 211 L137 237 H172 L185 214 M215 214 L215 239 H251 L240 209" fill="#8ae7b8"/>
    </g>}
    {kind==="cat"&&<g stroke="#46375f" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M224 197 Q298 143 289 210 Q281 252 242 214" fill="#ffca8a"/>
      <ellipse cx="181" cy="194" rx="74" ry="45" fill="#ffdfae"/>
      <path d="M111 117 L104 55 L151 93 L213 95 L255 55 L249 124" fill="#ffdfae"/>
      <ellipse cx="181" cy="133" rx="78" ry="67" fill="#fff4da"/>
      <path d="M119 92 L117 70 L142 95 M219 95 L242 70 L242 96" fill="#ffb2bc" strokeWidth="2"/>
      <ellipse cx="150" cy="128" rx="8" ry="12" fill="#46375f" stroke="none"/>
      <ellipse cx="213" cy="128" rx="8" ry="12" fill="#46375f" stroke="none"/>
      <path d="M175 149 L187 149 L181 158 Z" fill="#ff8da9" strokeWidth="2"/>
      <path d="M181 158 Q168 173 155 162 M181 158 Q195 173 207 162" fill="none" strokeWidth="3"/>
      <path d="M132 161 L95 155 M222 159 L260 153" fill="none" strokeWidth="2"/>
    </g>}
    {kind==="ocean"&&<g strokeLinejoin="round" strokeLinecap="round">
      <path d="M84 136 Q172 66 241 130 L296 87 L288 181 L245 161 Q165 222 84 158 Z" fill="#60c8e7" stroke="#32637a" strokeWidth="6"/>
      <path d="M141 138 Q182 101 210 140 Q188 175 141 160 Z" fill="#d4f2fc" stroke="none"/>
      <circle cx="123" cy="131" r="7" fill="#173f63"/>
      <path d="M131 155 Q144 168 155 154" fill="none" stroke="#173f63" strokeWidth="3"/>
      <path d="M174 107 L195 69 L214 105" fill="#56b3e9" stroke="#32637a" strokeWidth="5"/>
      <g fill="none" stroke="#fff" strokeWidth="5"><circle cx="77" cy="78" r="13"/><circle cx="250" cy="64" r="10"/><circle cx="299" cy="202" r="8"/></g>
      <path d="M50 214 Q90 188 126 218 T199 215 T273 216" fill="none" stroke="#58b4d8" strokeWidth="7"/>
    </g>}
    {kind==="car"&&<g stroke="#37395e" strokeWidth="5" strokeLinejoin="round">
      <path d="M88 147 L120 103 Q133 91 151 91 H219 Q234 95 245 120 L272 144 Q291 148 290 171 V194 Q286 208 269 210 H89 Q70 207 70 189 V163 Q70 150 88 147 Z" fill="#f89b92"/>
      <path d="M134 104 H219 L239 140 H111 Z" fill="#bdeffd"/>
      <path d="M180 105 L182 138" fill="none"/>
      <circle cx="121" cy="209" r="27" fill="#4b4567"/><circle cx="240" cy="209" r="27" fill="#4b4567"/>
      <circle cx="121" cy="209" r="12" fill="#fff"/><circle cx="240" cy="209" r="12" fill="#fff"/>
      <path d="M81 160 H110 M254 159 H276" stroke="#fff1b4" strokeWidth="8" strokeLinecap="round"/>
    </g>}
    {kind==="space"&&<g stroke="#4a3b79" strokeWidth="5" strokeLinejoin="round">
      <path d="M174 48 Q231 71 226 153 L196 203 L153 202 L124 151 Q129 70 174 48 Z" fill="#f6f0ff"/>
      <ellipse cx="175" cy="131" rx="32" ry="34" fill="#83d4f4"/>
      <path d="M128 160 L95 202 L147 191 M221 160 L252 201 L205 190" fill="#f9a6b5"/>
      <path d="M155 201 L161 236 L177 223 L194 236 L198 201" fill="#ffd16f"/>
      <circle cx="171" cy="126" r="9" fill="#46375f" stroke="none"/>
      <path d="M153 142 Q175 155 198 142" strokeWidth="3" fill="none"/>
      <path d="M69 78 L73 93 L89 97 L73 102 L69 118 L63 102 L47 97 L63 93 Z" fill="#fdd66a" stroke="none"/>
      <circle cx="262" cy="89" r="25" fill="#b8a2fd" stroke="none"/>
    </g>}
    {kind==="flower"&&<g strokeLinejoin="round">
      <path d="M171 178 Q182 219 185 246" fill="none" stroke="#449975" strokeWidth="9" strokeLinecap="round"/>
      <path d="M173 217 Q114 170 99 212 Q128 242 173 217 M186 229 Q228 186 258 219 Q234 250 186 229" fill="#67cc9a" stroke="#409771" strokeWidth="4"/>
      <g fill="#f99ebd" stroke="#b962a5" strokeWidth="3">
        <ellipse cx="181" cy="79" rx="29" ry="56"/><ellipse cx="181" cy="157" rx="29" ry="56"/>
        <ellipse cx="140" cy="118" rx="55" ry="28"/><ellipse cx="222" cy="118" rx="55" ry="28"/>
        <ellipse cx="148" cy="89" rx="25" ry="48" transform="rotate(-45 148 89)"/>
        <ellipse cx="210" cy="146" rx="25" ry="48" transform="rotate(-45 210 146)"/>
        <ellipse cx="212" cy="90" rx="25" ry="48" transform="rotate(45 212 90)"/>
        <ellipse cx="147" cy="149" rx="25" ry="48" transform="rotate(45 147 149)"/>
      </g>
      <circle cx="181" cy="117" r="38" fill="#ffdb78" stroke="#f0b85b" strokeWidth="5"/>
      <circle cx="169" cy="113" r="4" fill="#4a3858"/><circle cx="191" cy="113" r="4" fill="#4a3858"/>
      <path d="M170 127 Q181 137 192 126" fill="none" stroke="#4a3858" strokeWidth="3" strokeLinecap="round"/>
    </g>}
    {kind==="holiday"&&<g strokeLinejoin="round">
      <path d="M180 49 L207 108 L272 116 L226 161 L238 228 L180 197 L119 228 L132 161 L83 116 L149 108 Z" fill="#ffd570" stroke="#ca8c55" strokeWidth="6"/>
      <circle cx="159" cy="147" r="7" fill="#70445a"/><circle cx="203" cy="147" r="7" fill="#70445a"/>
      <path d="M165 167 Q180 183 195 167" fill="none" stroke="#70445a" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="78" cy="70" r="16" fill="#f98fae"/><circle cx="270" cy="66" r="13" fill="#95a2fa"/><circle cx="295" cy="198" r="11" fill="#8ee3b9"/>
    </g>}
    {kind==="rainbow"&&<g strokeLinecap="round" fill="none">
      <path d="M84 210 A98 98 0 0 1 280 210" stroke="#fb869b" strokeWidth="24"/>
      <path d="M105 210 A77 77 0 0 1 259 210" stroke="#ffd17a" strokeWidth="21"/>
      <path d="M127 210 A55 55 0 0 1 237 210" stroke="#8ddfbb" strokeWidth="19"/>
      <path d="M149 210 A33 33 0 0 1 215 210" stroke="#a9a1fa" strokeWidth="18"/>
      <g fill="white" stroke="none"><ellipse cx="92" cy="207" rx="35" ry="19"/><ellipse cx="260" cy="207" rx="36" ry="20"/></g>
    </g>}
    <g fill="#ffffff"><path d="M60 135 l5 -12 l5 12 l13 5 l-13 5 l-5 13 l-5 -13 l-13 -5Z"/><path d="M285 117 l4 -9 l4 9 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4Z"/></g>
  </svg>
 );
}
