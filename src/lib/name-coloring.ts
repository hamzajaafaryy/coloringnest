import font from "./name-coloring-glyphs.json" with { type: "json" };

export const MAX_NAME_LENGTH = 18;
export const NAME_THEMES = [
  { id: "butterflies", label: "Butterfly Wishes", short: "Butterflies", description: "Fluttering friends and little hearts", surface: "#fce8f1", ink: "#9d386d" },
  { id: "garden", label: "Garden Party", short: "Garden", description: "Happy flowers, leaves and sunshine", surface: "#e7f2e7", ink: "#3c714b" },
  { id: "space", label: "Cosmic Explorer", short: "Space", description: "Rockets, planets and twinkling stars", surface: "#ede8fb", ink: "#6e47a1" },
  { id: "dinosaurs", label: "Dino Days", short: "Dinosaurs", description: "Friendly dinosaurs and leafy adventures", surface: "#fff0d6", ink: "#8a5b22" },
] as const;

export type NameTheme = typeof NAME_THEMES[number]["id"];
export type NamePaper = "letter" | "a4";
export type NameSheetOptions = { name: string; theme: NameTheme; paper: NamePaper; tracing: boolean };
type Glyph = { path: string; advance: number; xMin: number; yMin: number; xMax: number; yMax: number };
const glyphs: Record<string, Glyph> = font.glyphs;
const INK = "#211c29";

export function validateColoringName(value: string): { name: string; error: string } {
  const name = value.normalize("NFC").replace(/\s+/g, " ").trim();
  if (!name) return { name, error: "Add a name to create your coloring page." };
  if (Array.from(name).length > MAX_NAME_LENGTH) return { name, error: `Keep your name to ${MAX_NAME_LENGTH} characters or fewer.` };
  if (!/\p{L}/u.test(name) || Array.from(name.toUpperCase()).some(char => !glyphs[char])) {
    return { name, error: "Use Latin letters (including accents), spaces, hyphens or apostrophes." };
  }
  return { name, error: "" };
}

export function escapeSvgText(value: string) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[char]!));
}

export function nameSheetDimensions(paper: NamePaper) {
  return paper === "a4" ? { width: 827, height: 1169 } : { width: 850, height: 1100 };
}

function rounded(value: number) { return Math.round(value * 1000) / 1000; }
function placed(body: string, x: number, y: number, scale = 1, rotation = 0) {
  return `<g transform="translate(${rounded(x)} ${rounded(y)}) rotate(${rotation}) scale(${scale})">${body}</g>`;
}

function star(radius = 25) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (i * 36 - 90) * Math.PI / 180;
    const r = i % 2 ? radius * 0.46 : radius;
    return `${rounded(Math.cos(angle) * r)},${rounded(Math.sin(angle) * r)}`;
  });
  return `<polygon points="${points.join(" ")}"/>`;
}
function heart() { return '<path d="M0 24C-7 17-31 3-26-12C-22-27-6-25 0-14C6-25 22-27 26-12C31 3 7 17 0 24Z"/>'; }
function sparkle() { return '<path d="M0-25Q4-5 24 0Q4 5 0 25Q-4 5-24 0Q-4-5 0-25Z"/>'; }
function cloud() { return '<path d="M-63 18C-92 18-92-19-64-21C-64-56-19-63-4-36C22-66 65-46 58-17C91-17 92 22 60 22H-63Z"/>'; }
function leaf() { return '<path d="M0 25Q-30-5 0-35Q30-5 0 25Z"/><path d="M0 22V-21" fill="none"/>'; }
function flower() {
  return Array.from({ length: 6 }, (_, i) => `<path transform="rotate(${i * 60})" d="M-9-11C-37-38-9-63 0-37C9-63 37-38 9-11Z"/>`).join("") + '<circle r="15"/>';
}
function butterfly() {
  return '<path d="M-4-10C-65-98-105-48-49 0C-109 4-65 82-6 18Z"/><path d="M4-10C65-98 105-48 49 0C109 4 65 82 6 18Z"/><ellipse cx="-41" cy="-27" rx="18" ry="22" transform="rotate(-30 -41 -27)"/><ellipse cx="41" cy="-27" rx="18" ry="22" transform="rotate(30 41 -27)"/><circle cx="-40" cy="27" r="11"/><circle cx="40" cy="27" r="11"/><ellipse cy="8" rx="9" ry="38"/><path d="M-3-27Q-21-62-29-45M3-27Q21-62 29-45" fill="none"/>';
}
function rocket() {
  return '<path d="M-25 8Q-55 14-50 58L-23 43ZM25 8Q55 14 50 58L23 43Z"/><path d="M-17 44Q-20 77 0 99Q20 77 17 44Z"/><path d="M-27 37C-38-7-22-47 0-64C22-47 38-7 27 37Z"/><path d="M-22-34Q0-25 22-34M-28 26H28" fill="none"/><circle cy="-6" r="16"/><path d="M0 42V72" fill="none"/>';
}
function planet() {
  return '<circle r="45"/><path d="M-43-6C-109 5-83 39-15 22C52 7 106-34 45-29L42-12C70-15 45 6-12 17C-63 28-76 16-43 11Z"/><circle cx="10" cy="-23" r="8"/><path d="M-22-29Q-5-40 12-38" fill="none"/>';
}
function dinosaur() {
  return '<path d="M-53 20Q-86 23-108 0Q-103 48-60 48Z"/><path d="M-62 39C-91 8-62-26-21-16Q-4-38-9-75Q-14-105 10-112Q47-121 50-92Q53-68 25-62L27-18Q62-6 65 36L78 57Q82 69 61 69H40V46H-4V70H-25V43Q-48 53-62 39Z"/><path d="M26-81Q35-75 43-83" fill="none"/><circle cx="24" cy="-98" r="3" fill="currentColor"/><circle cx="-40" cy="9" r="8"/><circle cx="-15" cy="0" r="9"/><circle cx="15" cy="12" r="8"/>';
}
function egg() { return '<path d="M0-50C25-50 44-5 42 18C41 56-41 56-42 18C-44-5-25-50 0-50Z"/><path d="M-38 7L-21-4L-5 10L10-4L26 11L40 0" fill="none"/>'; }

function decoration(theme: NameTheme, width: number, height: number, tracing: boolean) {
  const bottom = tracing ? height - 290 : height - 215;
  const common = placed(star(), width * 0.5, 177, 0.8, -12)
    + placed(sparkle(), 109, height * 0.49, 0.7)
    + placed(sparkle(), width - 109, height * 0.49, 0.7)
    + placed(star(), width * 0.48, bottom + 60, 0.65, 12);
  if (theme === "butterflies") return common
    + placed(butterfly(), 184, 259, 1.07, -13) + placed(butterfly(), width - 184, 256, 1.07, 15)
    + placed(flower(), 190, bottom, 1.0, -10) + placed(flower(), width - 190, bottom, 1.0, 12)
    + placed(heart(), width * 0.38, 274, 0.65, 12) + placed(heart(), width * 0.64, bottom - 19, 0.7, -12)
    + placed(cloud(), width * 0.5, bottom - 6, 0.7);
  if (theme === "garden") return common
    + placed(flower(), 183, 252, 1.3, -10) + placed(flower(), width - 190, 250, 1.3, 14)
    + placed(butterfly(), width * 0.5, 295, 0.62, 7)
    + placed(flower(), 205, bottom - 10, 1.25) + placed(flower(), width - 205, bottom - 10, 1.25, 30)
    + placed(leaf(), 145, bottom + 55, 0.8, -45) + placed(leaf(), width - 145, bottom + 55, 0.8, 45)
    + placed(heart(), width * 0.5, bottom - 10, 0.9);
  if (theme === "space") return common
    + placed(rocket(), 190, 255, 1.1, -22) + placed(planet(), width - 195, 245, 1.12, -12)
    + placed(star(35), width * 0.5, 300, 1, 8)
    + placed(planet(), 205, bottom, 1.1, 12) + placed(rocket(), width - 200, bottom - 10, 0.9, 22)
    + placed(sparkle(), width * 0.57, bottom - 52, 0.8) + placed(star(), width * 0.37, bottom - 30, 0.7);
  return common
    + placed(dinosaur(), 205, 269, 0.95, -5) + placed(egg(), width - 190, 259, 1.15, 12)
    + placed(leaf(), width * 0.53, 276, 1.1, -25)
    + placed(egg(), 190, bottom - 10, 0.95, -14) + placed(dinosaur(), width - 190, bottom + 10, 0.87, 4)
    + placed(leaf(), width * 0.45, bottom + 12, 0.85, -45);
}

export function layoutName(name: string, width: number, height: number, wrap = true) {
  const normalized = validateColoringName(name);
  if (normalized.error) throw new Error(normalized.error);
  const letters = normalized.name.toUpperCase();
  let rows = [letters];
  if (wrap && letters.length > 11 && letters.includes(" ")) {
    const spaces = Array.from(letters).flatMap((char, index) => char === " " ? [index] : []);
    const split = spaces.reduce((best, index) => Math.abs(index - letters.length / 2) < Math.abs(best - letters.length / 2) ? index : best);
    rows = [letters.slice(0, split), letters.slice(split + 1)];
  }
  return rows.map((row, rowIndex) => {
    let advance = 0;
    let yMin = 0;
    let yMax = 0;
    const characters = Array.from(row).map(char => {
      const glyph = glyphs[char];
      const position = { char, glyph, offset: advance };
      advance += glyph.advance + 34;
      yMin = Math.min(yMin, glyph.yMin);
      yMax = Math.max(yMax, glyph.yMax);
      return position;
    });
    const totalWidth = advance - 34;
    const maxHeight = rows.length === 1 ? 176 : 105;
    const scale = Math.min((width - 210) / totalWidth, maxHeight / (yMax - yMin));
    const centerY = height * 0.5 + (rows.length === 1 ? 0 : rowIndex === 0 ? -67 : 67);
    const x = (width - totalWidth * scale) / 2;
    const baseline = centerY + (yMax + yMin) * scale / 2;
    return { text: row, characters, x, baseline, scale, width: totalWidth * scale, top: baseline - yMax * scale, bottom: baseline - yMin * scale };
  });
}

function letterOutlines(name: string, width: number, height: number, wrap = true) {
  return layoutName(name, width, height, wrap).map(row =>
    `<g data-name-row="${escapeSvgText(row.text)}" transform="translate(${rounded(row.x)} ${rounded(row.baseline)}) scale(${rounded(row.scale)})">`
    + row.characters.filter(item => item.glyph.path).map(item => `<path d="${item.glyph.path}" transform="translate(${item.offset} 0)" vector-effect="non-scaling-stroke"/>`).join("") + "</g>"
  ).join("");
}

export function buildNameSheet(options: NameSheetOptions) {
  const checked = validateColoringName(options.name);
  if (checked.error) throw new Error(checked.error);
  const theme = NAME_THEMES.find(item => item.id === options.theme);
  if (!theme || !["letter", "a4"].includes(options.paper)) throw new Error("Choose an available theme and paper size.");
  const { width, height } = nameSheetDimensions(options.paper);
  const name = checked.name.toUpperCase();
  const title = `${name} ${theme.short.toLowerCase()} name coloring page`;
  const outlines = letterOutlines(name, width, height);
  const tracing = options.tracing
    ? `<text x="${width / 2}" y="${height - 177}" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="${INK}" stroke="none">Trace your name, then make it colorful.</text><g transform="translate(${width * 0.3} ${height - 115 - height * 0.2}) scale(0.4)" stroke-width="1.4" stroke-dasharray="5 4">${letterOutlines(name, width, height, false)}</g>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeSvgText(title)}"><title>${escapeSvgText(title)}</title><desc>Free personalized name coloring sheet with ${theme.description.toLowerCase()}. Print on ${options.paper === "a4" ? "A4" : "US Letter"} paper.</desc><metadata>Letter outlines derived from Fredoka. Copyright 2016 The Fredoka Project Authors. SIL Open Font License 1.1. https://github.com/google/fonts/tree/main/ofl/fredoka</metadata><rect width="${width}" height="${height}" fill="#fff"/><g fill="#fff" stroke="${INK}" color="${INK}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><rect x="31" y="31" width="${width - 62}" height="${height - 62}" rx="35"/><text x="${width / 2}" y="111" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" letter-spacing="3" fill="${INK}" stroke="none">MY COLORING PAGE</text>${decoration(options.theme, width, height, options.tracing)}<rect x="69" y="${height * 0.5 - 145}" width="${width - 138}" height="290" rx="57"/><g stroke-width="3.6">${outlines}</g>${tracing}<text x="${width / 2}" y="${height - 58}" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" fill="${INK}" stroke="none">CraftColoring · Made for ${escapeSvgText(name)}</text></g></svg>`;
}

export function nameSheetFilename(name: string, theme: NameTheme) {
  const slug = name.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
  return `${slug || "my-name"}-${theme}-coloring-page`;
}
