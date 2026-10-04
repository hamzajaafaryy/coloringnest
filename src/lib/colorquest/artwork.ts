import type { Friend, Paint } from "./story";

// Original vector illustrations: closed regions make tap-to-color predictable.
const region = (id: string, label: string, shape: string) =>
  shape.replace(
    /^<(\w+)/,
    `<$1 data-region="${id}" role="button" tabindex="0" aria-label="Color ${label}"`,
  );
const dragon = () =>
  [
    region(
      "dragon-wing",
      "dragon wing",
      '<path d="M405 250 Q530 95 590 180 L555 295 L505 260 L480 330 Z"/>',
    ),
    region(
      "dragon-tail",
      "dragon tail",
      '<path d="M415 370 Q590 415 635 290 Q690 485 430 465 Z"/>',
    ),
    region(
      "dragon-body",
      "dragon body",
      '<ellipse cx="365" cy="377" rx="128" ry="140"/>',
    ),
    region(
      "dragon-belly",
      "dragon belly",
      '<ellipse cx="365" cy="402" rx="74" ry="91"/>',
    ),
    region(
      "dragon-left-foot",
      "left foot",
      '<ellipse cx="270" cy="506" rx="62" ry="30"/>',
    ),
    region(
      "dragon-right-foot",
      "right foot",
      '<ellipse cx="454" cy="506" rx="62" ry="30"/>',
    ),
    region(
      "dragon-left-horn",
      "left horn",
      '<path d="M260 173 L260 75 L320 150 Z"/>',
    ),
    region(
      "dragon-right-horn",
      "right horn",
      '<path d="M402 143 L470 78 L472 191 Z"/>',
    ),
    region(
      "dragon-head",
      "dragon head",
      '<path d="M247 210 Q223 145 310 134 Q424 103 477 185 Q496 206 460 225 Q475 305 370 312 Q246 309 247 210 Z"/>',
    ),
    region(
      "dragon-cheek",
      "dragon cheek",
      '<ellipse cx="293" cy="239" rx="22" ry="15"/>',
    ),
    '<circle cx="313" cy="201" r="12" fill="#172033"/><circle cx="410" cy="201" r="12" fill="#172033"/><path d="M332 251 Q360 280 395 249" fill="none"/><path d="M252 501 L264 516 M280 500 L292 515 M437 500 L449 515 M463 500 L475 515" fill="none"/>',
  ].join("");
const tree = (x: number, y: number, id: string) =>
  `<g transform="translate(${x} ${y})">${region(`${id}-trunk`, "tree trunk", '<path d="M-17 90 L-17 235 L20 235 L20 90 Z"/>')}${region(`${id}-leaves`, "tree leaves", '<path d="M0 -30 Q-72 -35 -66 24 Q-124 42 -90 93 Q-106 143 -42 158 Q0 190 44 156 Q112 160 97 93 Q136 46 75 20 Q64 -40 0 -30 Z"/>')}</g>`;
const cloud = (id: string, x: number, y: number) =>
  region(
    id,
    "cloud",
    `<path d="M${x} ${y} q-35 -5 -27 -28 q4 -18 26 -16 q15 -45 50 -13 q33 -12 37 17 q35 32 -5 40 Z"/>`,
  );
const forest = () =>
  [
    region(
      "forest-ground",
      "forest meadow",
      '<path d="M35 500 Q180 455 310 483 Q450 433 765 493 L765 565 L35 565 Z"/>',
    ),
    region(
      "forest-path",
      "secret forest path",
      '<path d="M280 565 Q440 478 370 417 Q328 378 409 331 L440 331 Q385 381 427 419 Q509 481 452 565 Z"/>',
    ),
    tree(139, 179, "left-tree"),
    tree(625, 152, "right-tree"),
    tree(510, 258, "small-tree"),
    region("forest-sun", "sun", '<circle cx="366" cy="112" r="46"/>'),
    cloud("forest-cloud", 240, 106),
    region(
      "forest-mushroom-top",
      "mushroom cap",
      '<path d="M228 445 Q272 357 317 445 Z"/>',
    ),
    region(
      "forest-mushroom-stem",
      "mushroom stem",
      '<path d="M258 445 L258 482 L286 482 L286 445 Z"/>',
    ),
    '<circle cx="255" cy="426" r="6" fill="#172033"/><circle cx="286" cy="423" r="6" fill="#172033"/>',
  ].join("");
const friend = (kind: Friend) => {
  const ears =
    kind === "rabbit"
      ? region(
          "friend-left-ear",
          "left bunny ear",
          '<ellipse cx="303" cy="149" rx="36" ry="105" transform="rotate(-12 303 149)"/>',
        ) +
        region(
          "friend-right-ear",
          "right bunny ear",
          '<ellipse cx="464" cy="149" rx="36" ry="105" transform="rotate(12 464 149)"/>',
        )
      : kind === "cat"
        ? region(
            "friend-left-ear",
            "left cat ear",
            '<path d="M260 233 L250 92 L350 187 Z"/>',
          ) +
          region(
            "friend-right-ear",
            "right cat ear",
            '<path d="M421 187 L533 92 L515 243 Z"/>',
          )
        : region(
            "friend-spikes",
            "dinosaur spikes",
            '<path d="M250 195 L241 103 L303 161 L332 63 L376 154 L425 64 L448 159 L517 102 L508 232 Z"/>',
          );
  return [
    kind === "dinosaur"
      ? region(
          "friend-tail",
          "dinosaur tail",
          '<path d="M456 425 Q641 473 641 289 Q734 528 439 507 Z"/>',
        )
      : region(
          "friend-tail",
          "tail",
          '<ellipse cx="515" cy="425" rx="47" ry="53"/>',
        ),
    region(
      "friend-body",
      "friend body",
      '<ellipse cx="387" cy="407" rx="107" ry="119"/>',
    ),
    region(
      "friend-belly",
      "friend tummy",
      '<ellipse cx="387" cy="426" rx="66" ry="80"/>',
    ),
    ears,
    region(
      "friend-head",
      "friend face",
      '<ellipse cx="387" cy="269" rx="137" ry="111"/>',
    ),
    region(
      "friend-left-foot",
      "left foot",
      '<ellipse cx="296" cy="520" rx="65" ry="29"/>',
    ),
    region(
      "friend-right-foot",
      "right foot",
      '<ellipse cx="478" cy="520" rx="65" ry="29"/>',
    ),
    region(
      "friend-nose",
      "nose",
      '<path d="M369 291 Q387 273 405 291 L388 310 Z"/>',
    ),
    '<circle cx="329" cy="261" r="13" fill="#172033"/><circle cx="445" cy="261" r="13" fill="#172033"/><path d="M388 310 Q363 340 343 318 M388 310 Q413 340 433 318" fill="none"/>',
    kind === "cat"
      ? '<path d="M253 288 L205 278 M257 310 L201 312 M519 288 L569 278 M517 310 L570 312" fill="none"/>'
      : "",
    region(
      "friend-star",
      "lucky star",
      '<path d="M145 201 L159 233 L195 235 L168 259 L176 294 L145 276 L114 294 L122 259 L95 235 L131 233 Z"/>',
    ),
  ].join("");
};
const castle = () =>
  [
    region(
      "castle-ground",
      "castle lawn",
      '<path d="M50 523 Q220 477 400 522 Q600 476 750 523 L750 565 L50 565 Z"/>',
    ),
    ...[168, 138, 108].map((r, i) =>
      region(
        `rainbow-${i}`,
        "rainbow band",
        `<path d="M${400 - r} 251 A${r} ${r} 0 0 1 ${400 + r} 251 L${400 + r - 30} 251 A${r - 30} ${r - 30} 0 0 0 ${400 - r + 30} 251 Z"/>`,
      ),
    ),
    cloud("castle-cloud-left", 236, 264),
    cloud("castle-cloud-right", 547, 264),
    region(
      "castle-left-tower",
      "left tower",
      '<path d="M197 320 L197 531 L283 531 L283 320 Z"/>',
    ),
    region(
      "castle-right-tower",
      "right tower",
      '<path d="M517 320 L517 531 L603 531 L603 320 Z"/>',
    ),
    region(
      "castle-left-roof",
      "left tower roof",
      '<path d="M179 320 L240 237 L301 320 Z"/>',
    ),
    region(
      "castle-right-roof",
      "right tower roof",
      '<path d="M499 320 L560 237 L621 320 Z"/>',
    ),
    region(
      "castle-wall",
      "castle wall",
      '<path d="M283 366 L310 366 L310 339 L343 339 L343 366 L380 366 L380 339 L416 339 L416 366 L453 366 L453 339 L486 339 L486 366 L517 366 L517 531 L283 531 Z"/>',
    ),
    region(
      "castle-door",
      "castle door",
      '<path d="M358 531 L358 468 A42 42 0 0 1 442 468 L442 531 Z"/>',
    ),
    region(
      "castle-left-window",
      "left tower window",
      '<path d="M222 410 L222 374 A18 18 0 0 1 258 374 L258 410 Z"/>',
    ),
    region(
      "castle-right-window",
      "right tower window",
      '<path d="M542 410 L542 374 A18 18 0 0 1 578 374 L578 410 Z"/>',
    ),
    '<path d="M560 237 L560 166" fill="none"/>',
    region(
      "castle-flag",
      "castle flag",
      '<path d="M560 166 L623 186 L560 204 Z"/>',
    ),
    '<circle cx="424" cy="485" r="5" fill="#172033"/>',
  ].join("");

export function artwork(
  chapter: number,
  kind: Friend,
  paint: Paint = {},
  interactive = false,
) {
  const shapes =
    [dragon, forest, () => friend(kind), castle][chapter]?.() || dragon();
  let body = shapes.replace(
    /data-region="([a-z0-9-]+)"/g,
    (attribute, id) =>
      `${attribute} fill="${/^#[a-f0-9]{6}$/i.test(paint[id] || "") ? paint[id] : "#ffffff"}"`,
  );
  if (!interactive)
    body = body.replace(/ role="button" tabindex="0" aria-label="[^"]*"/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" aria-label="${["Little dragon", "Whispering forest", "Adventure friend", "Rainbow castle"][chapter] || "Coloring picture"}"><rect width="800" height="600" fill="#ffffff"/><g fill="#ffffff" stroke="#172033" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
}
