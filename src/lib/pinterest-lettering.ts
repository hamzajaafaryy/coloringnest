import font from "./name-coloring-glyphs.json" with { type: "json" };

type Glyph = { path: string; advance: number; yMax: number; yMin: number };
const glyphs: Record<string, Glyph> = font.glyphs;
const TRACKING = 24;
const punctuation: Record<string, Glyph> = {
  ".": { path: "M30 0C30-55 125-55 125 0C125 55 30 55 30 0Z", advance: 165, yMax: 55, yMin: -55 },
  "·": { path: "M30-300C30-355 125-355 125-300C125-245 30-245 30-300Z", advance: 165, yMax: 355, yMin: 245 },
  "?": { path: "M65-520C65-690 420-690 420-490C420-390 270-355 240-225H130C130-405 300-390 300-500C300-600 180-600 180-500ZM130 0H240V-110H130Z", advance: 500, yMax: 690, yMin: -110 },
  "!": { path: "M50-600C50-660 95-690 155-690C215-690 260-660 260-600L235-200H75ZM75 0H235V-125H75Z", advance: 310, yMax: 690, yMin: -125 },
};

function normalize(value: string): string {
  return value.replace(/&/g, " AND ").replace(/'/g, "’").replace(/\s+/g, " ").trim().normalize("NFC").toUpperCase();
}

function glyphFor(char: string): Glyph {
  return glyphs[char] || punctuation[char] || glyphs[char.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")] || glyphs["-"] || glyphs[" "];
}

function widthOf(text: string): number {
  const chars = Array.from(text);
  return chars.reduce((sum, char) => sum + glyphFor(char).advance, 0) + Math.max(0, chars.length - 1) * TRACKING;
}

/** Render the pinned Fredoka glyph outlines, independent of server fonts. */
export function letterPaths(text: string, opts: {
  x: number; y: number; fontSize: number; maxWidth: number; color: string;
  align?: "left" | "center" | "right";
}): string {
  const content = normalize(text);
  if (!content) return "";
  const chars = Array.from(content);
  const width = Math.max(1, widthOf(content));
  const fontSize = Math.max(6, Math.min(opts.fontSize, opts.maxWidth * 1000 / width));
  const scale = fontSize / 1000;
  const scaledWidth = width * scale;
  const align = opts.align || "left";
  const x = opts.x - (align === "center" ? scaledWidth / 2 : align === "right" ? scaledWidth : 0);
  let offset = 0;
  const paths: string[] = [];
  for (const char of chars) {
    const glyph = glyphFor(char);
    if (glyph.path) paths.push(`<path d="${glyph.path}" transform="translate(${offset} 0)"/>`);
    offset += glyph.advance + TRACKING;
  }
  return `<g fill="${opts.color}" transform="translate(${x.toFixed(2)} ${opts.y.toFixed(2)}) scale(${scale.toFixed(6)})">${paths.join("")}</g>`;
}

function wrapTitle(text: string, maxWidth: number): string[] {
  const words = normalize(text).split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";
  const addWord = (word: string) => {
    let fragment = "";
    for (const char of Array.from(word)) {
      if (fragment && widthOf(fragment + char) > maxWidth) {
        lines.push(fragment);
        fragment = char;
      } else fragment += char;
    }
    return fragment;
  };
  for (const word of words) {
    if (widthOf(word) > maxWidth) {
      if (current) lines.push(current);
      current = addWord(word);
      continue;
    }
    const candidate = current ? current + " " + word : word;
    if (current && widthOf(candidate) > maxWidth) {
      lines.push(current);
      current = word;
    } else current = candidate;
  }
  if (current) lines.push(current);
  return lines.length ? lines : ["FREE COLORING PAGE"];
}

export function titleLetterPaths(text: string, color: string): string {
  const maxWidth = 870;
  let size = 94;
  let lines: string[] = [];
  for (; size >= 48; size -= 2) {
    const candidate = wrapTitle(text, maxWidth * 1000 / size);
    if (candidate.length <= 2) {
      lines = candidate;
      break;
    }
  }
  if (!lines.length) {
    size = 48;
    lines = wrapTitle(text, maxWidth * 1000 / size).slice(0, 2);
    const last = lines.length - 1;
    while (lines[last].length && widthOf(lines[last] + "...") > maxWidth * 1000 / size) {
      lines[last] = lines[last].replace(/\s*\S*$/, "").trim();
    }
    lines[last] = (lines[last] || "COLORING") + "...";
  }

  const baselines = lines.length === 1 ? [314] : [260, 360];
  const shadow = lines.map((line, index) => letterPaths(line, {
    x: 505, y: baselines[index] + 8, fontSize: size, maxWidth, color: "#062F36", align: "center",
  })).join("");
  const title = lines.map((line, index) => letterPaths(line, {
    x: 500, y: baselines[index], fontSize: size, maxWidth, color, align: "center",
  })).join("");
  return shadow + title;
}
