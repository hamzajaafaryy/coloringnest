import type { ReactNode } from "react";

export type CartoonId = "kitty" | "unicorn" | "dino" | "bunny";
export type CartoonPaint = Record<string, string>;

export const CARTOONS: { id: CartoonId; name: string; subtitle: string; pieces: string[]; backdrop: string }[] = [
  {
    id: "kitty",
    name: "Mochi the Kitten",
    subtitle: "Meet the sweetest little garden explorer.",
    backdrop: "#dff4ff",
    pieces: ["tail", "body", "tummy", "left-ear", "right-ear", "face", "ears-inside", "scarf", "bow", "paws"],
  },
  {
    id: "unicorn",
    name: "Luna the Unicorn",
    subtitle: "Paint Luna in her magical cloud kingdom.",
    backdrop: "#f1e9ff",
    pieces: ["tail", "body", "hooves", "neck", "left-ear", "right-ear", "horn", "face", "muzzle", "mane-left", "mane-right", "fringe", "star"],
  },
  {
    id: "dino",
    name: "Dizzy the Dinosaur",
    subtitle: "Make a new prehistoric pal!",
    backdrop: "#e5f9eb",
    pieces: ["tail", "spikes", "body", "legs", "tummy", "neck", "head", "snout", "cheek", "spots"],
  },
  {
    id: "bunny",
    name: "Poppy the Bunny",
    subtitle: "Hop into a field of carrots and flowers.",
    backdrop: "#ffeef6",
    pieces: ["tail", "body", "feet", "tummy", "left-ear", "right-ear", "ears-inside", "head", "collar", "carrot", "carrot-leaves"],
  },
];

const OUTLINE = "#384063";
const SHADOW = "#e4d8f2";

function Part({
  id,
  label,
  fill,
  paint,
  onPaint,
  interactive,
  children,
}: {
  id: string;
  label: string;
  fill: string;
  paint: CartoonPaint;
  onPaint?: (id: string) => void;
  interactive: boolean;
  children: ReactNode;
}) {
  return (
    <g
      data-part={id}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `Color the ${label}` : undefined}
      className={interactive ? "cursor-pointer outline-none transition-[filter] duration-150 hover:brightness-[1.04] focus-visible:drop-shadow-[0_0_7px_#7c3aed]" : undefined}
      fill={paint[id] ?? fill}
      stroke={OUTLINE}
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={interactive ? () => onPaint?.(id) : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onPaint?.(id);
              }
            }
          : undefined
      }
    >
      {children}
    </g>
  );
}

function StorybookBackground({ id }: { id: CartoonId }) {
  const colors = {
    kitty: { sky: "#cbeeff", top: "#f4fcff", hill: "#bdeecf", foreground: "#8edcb7" },
    unicorn: { sky: "#e9ddff", top: "#fff9fe", hill: "#cde7ff", foreground: "#b9ccf9" },
    dino: { sky: "#c7f2db", top: "#f4fff3", hill: "#c0edcb", foreground: "#a0dab0" },
    bunny: { sky: "#ffe1ef", top: "#fffdf3", hill: "#d7f2cc", foreground: "#b7e3ab" },
  }[id];
  return (
    <>
      <defs>
        <linearGradient id={`storybook-sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={colors.sky}/>
          <stop offset="1" stopColor={colors.top}/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill={`url(#storybook-sky-${id})`}/>
      <circle cx="684" cy="96" r="48" fill="#fff0ab" opacity=".85"/>
      <g fill="#fff" opacity=".93">
        <ellipse cx="105" cy="108" rx="58" ry="22"/>
        <ellipse cx="74" cy="95" rx="32" ry="26"/>
        <ellipse cx="135" cy="92" rx="41" ry="30"/>
        <ellipse cx="585" cy="164" rx="50" ry="19"/>
        <ellipse cx="552" cy="156" rx="28" ry="24"/>
        <ellipse cx="615" cy="152" rx="30" ry="25"/>
      </g>
      <path d="M0 476 Q155 409 304 461 T800 448 V600 H0Z" fill={colors.hill}/>
      <path d="M0 526 Q181 477 360 526 T800 508 V600 H0Z" fill={colors.foreground}/>
      <g fill="#fff" opacity=".92">
        <path d="M80 261 l6 -17 6 17 17 6 -17 6 -6 17 -6 -17 -17 -6Z"/>
        <path d="M702 308 l5 -13 5 13 14 5 -14 5 -5 14 -5 -14 -14 -5Z"/>
        <circle cx="239" cy="83" r="4"/>
        <circle cx="730" cy="215" r="6"/>
      </g>
      <g stroke="#70b799" strokeWidth="4" strokeLinecap="round" opacity=".75">
        <path d="M74 551 l-9 -20 m9 20 l11 -25 m9 21 l9 -20"/>
        <path d="M700 542 l-12 -18 m12 18 l14 -22 m10 23 l10 -18"/>
      </g>
      <g stroke="none">
        <circle cx="97" cy="510" r="9" fill="#fff"/>
        <circle cx="97" cy="510" r="4" fill="#ffc66b"/>
        <circle cx="689" cy="486" r="10" fill="#fff"/>
        <circle cx="689" cy="486" r="5" fill="#ffafcc"/>
        <circle cx="727" cy="541" r="6" fill="#ffd884"/>
      </g>
    </>
  );
}

function Kitty({ paint, onPaint, interactive }: ArtProps) {
  return (
    <>
      <ellipse cx="402" cy="516" rx="181" ry="26" fill="#46516d" opacity=".12"/>
      <Part id="tail" label="curly tail" fill="#f6cb94" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M503 415 C580 405 606 337 567 315 C532 295 507 326 522 350 C537 372 568 354 554 341 C552 362 531 380 512 382 L481 440 Z"/>
      </Part>
      <Part id="body" label="kitten body" fill="#fbe0ab" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M324 358 C282 366 262 432 278 479 C294 522 505 525 524 477 C538 435 521 374 482 357 Q408 328 324 358Z"/>
      </Part>
      <Part id="tummy" label="round tummy" fill="#fff5db" paint={paint} onPaint={onPaint} interactive={interactive}>
        <ellipse cx="401" cy="442" rx="88" ry="66"/>
      </Part>
      <Part id="left-ear" label="left ear" fill="#f8cc95" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M273 250 L255 111 Q254 87 278 100 L373 180 Z"/>
      </Part>
      <Part id="right-ear" label="right ear" fill="#f8cc95" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M439 180 L537 100 Q555 91 553 115 L533 262 Z"/>
      </Part>
      <Part id="face" label="kitten face" fill="#ffebc2" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M278 228 C309 176 365 166 405 169 C470 170 518 211 537 268 C563 348 509 408 424 415 C322 425 257 388 251 313 C248 272 259 247 278 228Z"/>
      </Part>
      <Part id="ears-inside" label="inner ears" fill="#f7a7bd" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M288 193 L280 133 L341 180 Z"/>
        <path d="M470 180 L533 132 L518 199 Z"/>
      </Part>
      <Part id="paws" label="kitten paws" fill="#fff0d0" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M300 479 Q275 456 245 470 Q220 487 232 509 Q247 526 305 517 Q322 504 300 479Z"/>
        <path d="M494 478 Q526 459 557 470 Q579 480 568 506 Q554 523 495 519 Q477 503 494 478Z"/>
      </Part>
      <Part id="scarf" label="collar ribbon" fill="#a6a0f5" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M308 399 Q404 436 502 396 L501 421 Q408 459 308 422 Z"/>
      </Part>
      <Part id="bow" label="ribbon bow" fill="#f8a5ba" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M390 431 Q347 400 343 436 Q342 470 391 446 Q437 479 455 451 Q465 414 412 431Z"/>
      </Part>
      <g pointerEvents="none">
        <ellipse cx="349" cy="294" rx="15" ry="22" fill={OUTLINE}/>
        <ellipse cx="461" cy="294" rx="15" ry="22" fill={OUTLINE}/>
        <circle cx="355" cy="284" r="6" fill="#fff"/>
        <circle cx="467" cy="284" r="6" fill="#fff"/>
        <ellipse cx="310" cy="337" rx="29" ry="13" fill="#ffa2ad" opacity=".7"/>
        <ellipse cx="502" cy="337" rx="29" ry="13" fill="#ffa2ad" opacity=".7"/>
        <path d="M388 335 Q404 342 419 335 L405 350 Z" fill="#eb8296" stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round"/>
        <g fill="none" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round">
          <path d="M404 351 Q391 371 377 358 M404 351 Q417 371 432 358"/>
          <path d="M307 352 L250 338 M309 362 L249 364 M499 350 L555 338 M495 362 L556 365"/>
          <path d="M261 494 L263 504 M286 496 L285 508 M518 494 L518 506 M544 489 L543 503"/>
        </g>
        <circle cx="402" cy="439" r="9" fill="#ffe79a" stroke={OUTLINE} strokeWidth="3"/>
      </g>
    </>
  );
}

function Unicorn({ paint, onPaint, interactive }: ArtProps) {
  return (
    <>
      <ellipse cx="408" cy="522" rx="177" ry="25" fill="#4a4b80" opacity=".12"/>
      <Part id="tail" label="rainbow tail" fill="#efb4de" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M511 389 C609 347 638 398 615 447 C596 491 575 483 550 504 C571 463 568 450 524 454Z"/>
      </Part>
      <Part id="body" label="unicorn body" fill="#fff6e8" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M326 343 Q400 319 474 353 C525 369 535 441 509 488 Q490 516 405 520 Q308 521 292 484 Q270 405 326 343Z"/>
      </Part>
      <Part id="hooves" label="little hooves" fill="#b8b8fa" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M321 463 Q336 449 357 468 L358 511 Q326 534 301 509Z"/>
        <path d="M451 467 Q467 447 490 470 L504 510 Q478 534 452 507Z"/>
      </Part>
      <Part id="neck" label="neck" fill="#f5f1ff" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M359 337 L357 258 Q408 227 460 266 L460 370 Q411 409 354 376Z"/>
      </Part>
      <Part id="mane-left" label="left flowing mane" fill="#f9b2ce" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M321 219 Q279 251 278 316 Q246 366 277 415 Q299 381 316 396 Q278 342 335 299Z"/>
      </Part>
      <Part id="mane-right" label="right flowing mane" fill="#a7a5fc" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M468 220 Q525 235 536 304 Q567 369 523 425 Q520 381 493 391 Q516 340 466 297Z"/>
      </Part>
      <Part id="left-ear" label="left ear" fill="#fff0f2" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M332 212 L303 108 Q301 82 326 95 L386 172 Z"/>
      </Part>
      <Part id="right-ear" label="right ear" fill="#fff0f2" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M438 171 L492 95 Q512 83 511 109 L479 219 Z"/>
      </Part>
      <Part id="horn" label="sparkly horn" fill="#ffd26f" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M377 177 L412 63 Q417 52 423 65 L446 180Z"/>
      </Part>
      <Part id="face" label="unicorn face" fill="#fff8ee" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M332 196 Q369 158 420 168 C475 173 500 224 485 299 Q473 369 412 392 Q348 379 328 328 C311 286 310 223 332 196Z"/>
      </Part>
      <Part id="muzzle" label="nose and muzzle" fill="#ffe0ec" paint={paint} onPaint={onPaint} interactive={interactive}>
        <ellipse cx="409" cy="348" rx="75" ry="49"/>
      </Part>
      <Part id="fringe" label="rainbow fringe" fill="#87dded" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M335 204 Q333 156 378 150 Q427 127 464 166 Q490 193 472 245 Q458 222 442 231 Q424 246 417 221 Q389 252 369 226 Q342 251 335 204Z"/>
      </Part>
      <Part id="star" label="magic star necklace" fill="#ffe69c" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M403 414 L415 437 L442 440 L424 460 L428 486 L403 475 L379 486 L384 459 L364 440 L391 438Z"/>
      </Part>
      <g pointerEvents="none">
        <ellipse cx="365" cy="279" rx="13" ry="22" fill={OUTLINE}/>
        <ellipse cx="454" cy="279" rx="13" ry="22" fill={OUTLINE}/>
        <circle cx="369" cy="270" r="5" fill="#fff"/>
        <circle cx="458" cy="270" r="5" fill="#fff"/>
        <ellipse cx="355" cy="325" rx="16" ry="8" fill="#f9adc2" opacity=".78"/>
        <ellipse cx="464" cy="325" rx="16" ry="8" fill="#f9adc2" opacity=".78"/>
        <ellipse cx="385" cy="350" rx="5" ry="4" fill="#bd849d"/>
        <ellipse cx="434" cy="350" rx="5" ry="4" fill="#bd849d"/>
        <path d="M390 369 Q412 390 430 369" fill="none" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round"/>
        <path d="M406 94 L427 106 M397 124 L442 142" stroke="#c98f42" strokeWidth="4" strokeLinecap="round"/>
        <path d="M342 267 l-12 -7 M476 266 l12 -8" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round"/>
        <circle cx="403" cy="449" r="4" fill="#fff"/>
      </g>
    </>
  );
}

function Dino({ paint, onPaint, interactive }: ArtProps) {
  return (
    <>
      <ellipse cx="407" cy="526" rx="210" ry="24" fill="#4b725a" opacity=".13"/>
      <Part id="tail" label="dinosaur tail" fill="#75d4ae" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M519 411 C611 393 656 334 672 267 Q683 387 629 455 Q590 493 514 477Z"/>
      </Part>
      <Part id="spikes" label="back spikes" fill="#ffc06c" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M456 309 L473 268 L503 307 L519 284 L545 336 L565 325 L573 375 L592 373 L574 426 L518 444Z"/>
      </Part>
      <Part id="legs" label="dinosaur feet" fill="#70d6ad" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M317 457 L377 465 Q389 496 380 516 Q364 533 298 526 Q281 510 317 457Z"/>
        <path d="M468 454 L521 461 Q546 500 528 523 Q506 537 453 521 Q442 502 468 454Z"/>
      </Part>
      <Part id="body" label="dinosaur body" fill="#83e1ae" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M290 334 C347 280 452 294 517 348 C560 390 559 461 526 494 C484 537 330 526 292 490 C245 446 247 378 290 334Z"/>
      </Part>
      <Part id="tummy" label="round tummy" fill="#ddfbd0" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M335 366 Q403 329 466 373 C488 409 481 465 456 497 Q394 518 342 488 Q305 448 335 366Z"/>
      </Part>
      <Part id="neck" label="long neck" fill="#8be8ba" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M260 365 Q258 319 276 258 L290 204 Q326 181 368 216 L383 339 Q363 401 305 405Z"/>
      </Part>
      <Part id="head" label="dinosaur head" fill="#8fe6b6" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M238 170 Q268 124 340 129 C414 135 441 181 428 234 Q414 284 351 293 Q299 301 250 270 Q209 244 213 201 Q215 183 238 170Z"/>
      </Part>
      <Part id="snout" label="dinosaur snout" fill="#a5efd1" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M218 210 Q258 185 304 212 Q336 237 306 268 Q280 288 236 266 Q205 249 218 210Z"/>
      </Part>
      <Part id="cheek" label="happy cheek" fill="#f8aaaf" paint={paint} onPaint={onPaint} interactive={interactive}>
        <ellipse cx="380" cy="250" rx="22" ry="13"/>
      </Part>
      <Part id="spots" label="dinosaur spots" fill="#43cfa6" paint={paint} onPaint={onPaint} interactive={interactive}>
        <ellipse cx="470" cy="381" rx="16" ry="12"/>
        <ellipse cx="495" cy="418" rx="12" ry="10"/>
        <ellipse cx="450" cy="431" rx="11" ry="9"/>
      </Part>
      <g pointerEvents="none">
        <ellipse cx="352" cy="202" rx="14" ry="19" fill={OUTLINE}/>
        <circle cx="357" cy="194" r="5" fill="#fff"/>
        <ellipse cx="246" cy="239" rx="6" ry="5" fill="#4b5c63"/>
        <path d="M247 258 Q278 282 307 256" fill="none" stroke={OUTLINE} strokeWidth="5" strokeLinecap="round"/>
        <path d="M315 510 L318 519 M341 512 L345 520 M479 507 L479 521 M507 509 L506 521" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round"/>
        <path d="M312 136 L330 102 L345 132 M360 138 L386 110 L392 152" fill="#ffc777" stroke={OUTLINE} strokeWidth="6" strokeLinejoin="round"/>
      </g>
    </>
  );
}

function Bunny({ paint, onPaint, interactive }: ArtProps) {
  return (
    <>
      <ellipse cx="401" cy="518" rx="182" ry="25" fill="#5d5277" opacity=".12"/>
      <Part id="tail" label="fluffy bunny tail" fill="#f9fafc" paint={paint} onPaint={onPaint} interactive={interactive}>
        <circle cx="519" cy="423" r="50"/>
      </Part>
      <Part id="body" label="bunny body" fill="#f5edfe" paint={paint} onPaint={onPaint} interactive={interactive}>
        <ellipse cx="405" cy="418" rx="131" ry="103"/>
      </Part>
      <Part id="feet" label="bunny feet" fill="#fff8fa" paint={paint} onPaint={onPaint} interactive={interactive}>
        <ellipse cx="309" cy="499" rx="59" ry="32"/>
        <ellipse cx="503" cy="499" rx="59" ry="32"/>
      </Part>
      <Part id="tummy" label="fluffy tummy" fill="#fff" paint={paint} onPaint={onPaint} interactive={interactive}>
        <ellipse cx="408" cy="442" rx="75" ry="64"/>
      </Part>
      <Part id="left-ear" label="left tall ear" fill="#f5edfe" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M312 221 Q250 115 277 60 Q300 25 328 69 Q362 137 365 215Z"/>
      </Part>
      <Part id="right-ear" label="right tall ear" fill="#f5edfe" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M427 214 Q430 112 482 54 Q511 27 519 66 Q526 133 474 229Z"/>
      </Part>
      <Part id="ears-inside" label="pink ear centers" fill="#f8b5c9" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M310 184 Q284 111 299 83 Q322 110 342 194Z"/>
        <path d="M451 192 Q471 113 498 82 Q496 134 467 205Z"/>
      </Part>
      <Part id="head" label="bunny face" fill="#fcf8ff" paint={paint} onPaint={onPaint} interactive={interactive}>
        <ellipse cx="400" cy="297" rx="148" ry="126"/>
      </Part>
      <Part id="collar" label="flower collar" fill="#c8acfc" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M320 397 Q400 436 485 392 L493 415 Q411 461 315 425Z"/>
      </Part>
      <Part id="carrot" label="orange carrot" fill="#ffac6e" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M569 394 Q621 394 646 415 L584 534 Q570 541 571 523 L545 420Q548 401 569 394Z"/>
      </Part>
      <Part id="carrot-leaves" label="carrot leaves" fill="#75d09e" paint={paint} onPaint={onPaint} interactive={interactive}>
        <path d="M585 398 Q553 374 559 345 Q582 346 593 376 Q594 333 624 329 Q631 362 606 389 Q642 364 654 388 Q632 408 585 398Z"/>
      </Part>
      <g pointerEvents="none">
        <ellipse cx="346" cy="288" rx="13" ry="20" fill={OUTLINE}/>
        <ellipse cx="454" cy="288" rx="13" ry="20" fill={OUTLINE}/>
        <circle cx="351" cy="279" r="5" fill="#fff"/>
        <circle cx="459" cy="279" r="5" fill="#fff"/>
        <ellipse cx="312" cy="323" rx="26" ry="11" fill="#f8a7b9" opacity=".75"/>
        <ellipse cx="486" cy="323" rx="26" ry="11" fill="#f8a7b9" opacity=".75"/>
        <path d="M388 322 Q400 330 413 322 L401 338Z" fill="#ed8caa" stroke={OUTLINE} strokeWidth="4"/>
        <path d="M401 338 Q387 359 374 345 M401 338 Q414 359 428 345" fill="none" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round"/>
        <path d="M323 343 L267 334 M326 356 L268 359 M479 343 L534 335 M477 356 L536 360" fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round"/>
        <path d="M300 499 L302 507 M321 500 L323 507 M490 499 L489 507 M513 499 L513 507" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round"/>
        <path d="M574 437 L591 444 M579 466 L595 470 M584 492 L594 496" stroke="#d87e4b" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="403" cy="427" r="10" fill="#ffe89e" stroke={OUTLINE} strokeWidth="3"/>
      </g>
    </>
  );
}

type ArtProps = {
  paint: CartoonPaint;
  onPaint?: (id: string) => void;
  interactive: boolean;
};

export default function CartoonCharacter({
  id,
  paint = {},
  onPaint,
  interactive = true,
  className = "",
}: {
  id: CartoonId;
  paint?: CartoonPaint;
  onPaint?: (id: string) => void;
  interactive?: boolean;
  className?: string;
}) {
  const Illustration = id === "kitty" ? Kitty : id === "unicorn" ? Unicorn : id === "dino" ? Dino : Bunny;
  return (
    <svg
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={CARTOONS.find((item) => item.id === id)?.name || "Cartoon coloring illustration"}
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <StorybookBackground id={id}/>
      <Illustration paint={paint} onPaint={onPaint} interactive={interactive}/>
    </svg>
  );
}
