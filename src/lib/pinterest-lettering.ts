import { brotliDecompressSync } from "node:zlib";
import { PINTEREST_GLYPHS_BROTLI } from "./pinterest-font-data.ts";

/**
 * Reliable PIN PNG lettering via SVG outlines, not SVG <text> or host fonts.
 * The small set of glyph outlines is derived from OFL-licensed Inter Display Black.
 * Attribution and the license are in docs/pinterest-type-license.md.
 */
const glyphs = JSON.parse(brotliDecompressSync(Buffer.from(PINTEREST_GLYPHS_BROTLI, "base64")).toString("utf8")) as Record<string, [number, string]>;

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim().normalize("NFC");
}

function glyphFor(char: string): [number, string] {
  return glyphs[char] || glyphs[char.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")] || glyphs["?"];
}

function widthOf(text: string): number {
  const chars = Array.from(text);
  const tracking = Math.max(0, chars.length - 1) * -10;
  return chars.reduce((sum, char) => sum + glyphFor(char)[0], 0) + tracking;
}

/** All output is vector paths. This is independent of server fontconfig. */
export function letterPaths(text: string, opts: {
  x: number; y: number; fontSize: number; maxWidth: number; color: string;
  align?: "left" | "center" | "right";
}): string {
  const content = normalize(text);
  if (!content) return "";
  const width = Math.max(1, widthOf(content));
  const fontSize = Math.max(6, Math.min(opts.fontSize, opts.maxWidth * 1000 / width));
  const scaledWidth = width * fontSize / 1000;
  const align = opts.align || "left";
  const x = opts.x - (align === "center" ? scaledWidth / 2 : align === "right" ? scaledWidth : 0);
  let offset = 0;
  const paths: string[] = [];
  for (const char of Array.from(content)) {
    const [advance, path] = glyphFor(char);
    if (path) paths.push(`<path d="${path}" transform="translate(${offset} 0)"/>`);
    offset += advance - 10;
  }
  return `<g fill="${opts.color}" transform="translate(${x.toFixed(2)} ${opts.y.toFixed(2)}) scale(${(fontSize / 1000).toFixed(6)} -${(fontSize / 1000).toFixed(6)})">${paths.join("")}</g>`;
}

function wrappedTitle(text: string, fontSize: number, maxWidth: number): string[] {
  const words = normalize(text).split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";
  const budget = maxWidth * 1000 / fontSize;
  for (const word of words) {
    const candidate = current ? current + " " + word : word;
    if (current && widthOf(candidate) > budget) {
      lines.push(current);
      current = word;
    } else current = candidate;
  }
  if (current) lines.push(current);
  return lines;
}

export function titleLetterPaths(text: string, color: string): string {
  let size = 72;
  let lines: string[] = [];
  for (size = 72; size >= 43; size -= 2) {
    lines = wrappedTitle(text, size, 790);
    if (lines.length <= 3 && lines.every(line => widthOf(line) * size / 1000 <= 815)) break;
  }
  if (lines.length > 3) {
    const words = normalize(text).split(" ");
    const chunk = Math.ceil(words.length / 3);
    lines = [words.slice(0,chunk),words.slice(chunk,2*chunk),words.slice(2*chunk)].map(w=>w.join(" "));
  }
  const step = size + 12;
  const center = 289;
  const start = center - (lines.length - 1) * step / 2;
  return lines.map((line,i)=>letterPaths(line,{x:500,y:start+i*step,fontSize:size,maxWidth:818,color,align:"center"})).join("");
}
