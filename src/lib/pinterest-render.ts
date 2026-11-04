import sharp from "sharp";
import { isPinTemplate, type PinTemplate } from "./pinterest-studio.ts";
import { letterPaths, titleLetterPaths } from "./pinterest-lettering.ts";

const STYLES = {
  editorial: { bg: "#FFF8EE", ink: "#56306F", accent: "#9B64BE", secondary: "#EFC955", soft: "#F4E2F6", paper: "#FFFFFF", label: "#FBEEFF" },
  lilac: { bg: "#EEDFFF", ink: "#52277E", accent: "#8248B7", secondary: "#FFD968", soft: "#FBF3FF", paper: "#FFFFFF", label: "#FFDF6A" },
  sunshine: { bg: "#FFF0B9", ink: "#49326C", accent: "#EB8C50", secondary: "#9356B9", soft: "#FFF9E8", paper: "#FFFFFF", label: "#FFFFFF" },
  midnight: { bg: "#2D2345", ink: "#FFF8F0", accent: "#EAC670", secondary: "#AD8AE1", soft: "#47385F", paper: "#FFFFFF", label: "#47385F" },
  papercut: { bg: "#DDF3EB", ink: "#1E5963", accent: "#327980", secondary: "#F2BA52", soft: "#FFF5E7", paper: "#FFFFFF", label: "#FFFFFF" },
} as const;

type RenderOptions = {
  template: PinTemplate;
  headline: string;
  category?: string | null;
  image: Buffer | Uint8Array;
};

function decorate(template: PinTemplate, accent: string, second: string): string {
  if (template === "editorial") {
    return `<circle cx="932" cy="105" r="130" fill="${accent}" opacity=".11"/>
      <path d="M44 395 Q120 352 195 393" fill="none" stroke="${second}" stroke-width="13" stroke-linecap="round"/>
      <circle cx="55" cy="1200" r="30" fill="${second}" opacity=".30"/>`;
  }
  if (template === "lilac") {
    return `<circle cx="960" cy="140" r="160" fill="${second}" opacity=".65"/>
      <path d="M30 368q53-71 106 0t104 0" fill="none" stroke="${accent}" stroke-width="12" opacity=".28"/>
      <path d="M877 370l13 27 28 10-28 9-13 28-10-28-27-9 27-10z" fill="${second}"/>`;
  }
  if (template === "sunshine") {
    return `<circle cx="920" cy="100" r="165" fill="${accent}" opacity=".13"/>
      <path d="M55 425l13-29 13 29 29 13-29 13-13 29-13-29-29-13z" fill="${second}" opacity=".55"/>
      <circle cx="900" cy="1350" r="60" fill="${accent}" opacity=".18"/>`;
  }
  if (template === "midnight") {
    return `<circle cx="920" cy="56" r="140" fill="${accent}" opacity=".13"/>
      <circle cx="73" cy="367" r="23" fill="${second}" opacity=".40"/>
      <path d="M880 384l12 30 30 12-30 12-12 30-12-30-30-12 30-12z" fill="${accent}" opacity=".74"/>`;
  }
  return `<circle cx="920" cy="118" r="148" fill="${second}" opacity=".25"/>
    <path d="M34 364q56-26 108 14t100-4" fill="none" stroke="${accent}" stroke-width="13" opacity=".23"/>
    <path d="M915 380q-22-52-55 0 33 29 55 0zm0 0q22-52 55 0-33 29-55 0z" fill="${accent}" opacity=".45"/>`;
}

/** Produce a real 1000×1500 PNG. The original drawing is composited, never redrawn. */
export async function renderPinterestPin({
  template, headline, category, image,
}: RenderOptions): Promise<Buffer> {
  if (!isPinTemplate(template)) throw new Error("Invalid Pinterest template");
  const source = Buffer.from(image);
  if (!source.length || source.length > 18 * 1024 * 1024) throw new Error("Artwork image is too large");
  const metadata = await sharp(source, { limitInputPixels: 40_000_000, failOn: "error" }).metadata();
  if (!metadata.width || !metadata.height || !["png", "jpeg", "webp", "avif"].includes(metadata.format || "")) {
    throw new Error("A PNG, JPEG, WebP or AVIF artwork image is required");
  }
  const c = STYLES[template];
  const title = headline.replace(/\s+/g, " ").trim().slice(0, 90) || "Free Printable Coloring Page";
  const headerLines = titleLetterPaths(title, c.ink);
  const cat = (category || "Coloring Pages").trim().slice(0, 50);
  const artX = 116, artY = 491, artW = 768, artH = 808;
  const paperTop = template === "papercut"
    ? `<rect x="84" y="463" width="850" height="861" rx="26" fill="#68B5AF" transform="rotate(2 500 880)" opacity=".5"/>`
    : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">
    <rect width="1000" height="1500" fill="${c.bg}"/>
    ${decorate(template, c.accent, c.secondary)}
    <rect x="293" y="46" width="414" height="56" rx="28" fill="${c.label}"/>
    ${letterPaths("FREE PRINTABLE",{x:500,y:83,fontSize:23,maxWidth:380,color:template === "midnight" ? "#FFF7E6" : c.accent,align:"center"})}
    ${headerLines}
    ${paperTop}
    <rect x="78" y="457" width="844" height="878" rx="31" fill="#352C42" opacity=".10"/>
    <rect x="72" y="451" width="856" height="874" rx="29" fill="${c.paper}" stroke="#EDE3EB" stroke-width="5"/>
    <rect x="104" y="480" width="792" height="832" rx="13" fill="#FFFFFF"/>
    <rect x="68" y="1363" width="864" height="1" fill="${c.accent}" opacity=".26"/>
    ${letterPaths("CraftColoring",{x:72,y:1423,fontSize:30,maxWidth:490,color:c.ink})}
    ${letterPaths("FREE TO PRINT · FUN TO COLOR",{x:72,y:1460,fontSize:19,maxWidth:470,color:c.ink})}
    ${letterPaths(cat.slice(0, 34),{x:929,y:1414,fontSize:19,maxWidth:330,color:c.ink,align:"right"})}
    ${letterPaths("craftcoloring.com",{x:929,y:1456,fontSize:20,maxWidth:330,color:c.ink,align:"right"})}
  </svg>`;
  const illustration = await sharp(source, {limitInputPixels: 40_000_000})
    .rotate().flatten({ background: "#FFFFFF" })
    .resize(artW, artH, { fit: "contain", background: "#FFFFFF", withoutEnlargement: false })
    .png().toBuffer();
  // Keep the artwork on top of the blank paper, but never distort/crop it.
  return sharp(Buffer.from(svg))
    .composite([{ input: illustration, left: artX, top: artY }])
    .png({ compressionLevel: 9, effort: 7 }).toBuffer();
}

export async function fetchPinterestArtworkImage(imageUrl: string): Promise<Buffer> {
  const storage = process.env.SUPABASE_URL;
  if (!storage) throw new Error("Supabase image storage is not configured");
  const base = new URL(storage);
  const image = new URL(imageUrl);
  const prefix = "/storage/v1/object/public/coloring-pages/";
  if (base.protocol !== "https:" || image.protocol !== "https:" ||
      image.origin !== base.origin || image.username || image.password ||
      image.search || image.hash || !image.pathname.startsWith(prefix) ||
      !/\.(png|jpe?g|webp|avif)$/i.test(image.pathname)) {
    throw new Error("Artwork must be a public CraftColoring image");
  }
  const response = await fetch(image.href, {
    redirect: "error", cache: "no-store", signal: AbortSignal.timeout(15000),
    headers: { Accept: "image/png,image/webp,image/jpeg,image/avif" },
  });
  if (!response.ok) throw new Error("Could not load the original artwork");
  const length = Number(response.headers.get("content-length") || "0");
  if (length > 18 * 1024 * 1024) throw new Error("Artwork is too large");
  const body = Buffer.from(await response.arrayBuffer());
  if (body.length > 18 * 1024 * 1024) throw new Error("Artwork exceeds 18 MB");
  return body;
}
