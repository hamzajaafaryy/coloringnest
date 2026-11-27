import sharp from "sharp";
import { isPinTemplate, type PinTemplate } from "./pinterest-studio.ts";
import { letterPaths, titleLetterPaths } from "./pinterest-lettering.ts";

type RenderOptions = {
  template: PinTemplate;
  headline: string;
  category?: string | null;
  image: Buffer | Uint8Array;
};

const ART = { x: 150, y: 499, width: 700, height: 660 } as const;

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

  const title = headline.replace(/\s+/g, " ").trim().slice(0, 90) || "Free Printable Coloring Page";
  const cat = (category || "Coloring Pages").replace(/\s+/g, " ").trim().slice(0, 38);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">
    <rect width="1000" height="1500" fill="#0B3C45"/>
    <path d="M0 0H1000V456Q790 494 500 460Q210 426 0 474Z" fill="#11535C"/>
    <circle cx="87" cy="369" r="37" fill="none" stroke="#75B4AE" stroke-width="5"/>
    <circle cx="913" cy="359" r="27" fill="none" stroke="#75B4AE" stroke-width="5"/>
    <path d="M183 395l8 19 20 8-20 8-8 20-8-20-20-8 20-8zM807 414l7 16 17 7-17 7-7 17-7-17-17-7 17-7z" fill="none" stroke="#F6D65C" stroke-width="4" stroke-linejoin="round"/>
    <rect x="275" y="52" width="450" height="64" rx="32" fill="#F8D84E"/>
    ${letterPaths("PRINTABLE COLORING PAGE",{x:500,y:97,fontSize:23,maxWidth:420,color:"#103A41",align:"center"})}
    ${titleLetterPaths(title,"#FFFFFF")}
    ${letterPaths("A FUN PAGE TO PRINT, COLOR & ENJOY",{x:500,y:423,fontSize:24,maxWidth:830,color:"#F8D84E",align:"center"})}

    <rect x="112" y="467" width="790" height="744" rx="43" fill="#F8D84E" transform="rotate(-1.2 507 839)"/>
    <rect x="96" y="450" width="790" height="744" rx="43" fill="#082F36" transform="rotate(-1.2 491 822)"/>
    <rect x="108" y="462" width="766" height="720" rx="31" fill="#FFFFFF" stroke="#082F36" stroke-width="9" transform="rotate(-1.2 491 822)"/>
    <rect x="138" y="486" width="724" height="690" rx="18" fill="#FFFFFF"/>

    <rect x="300" y="1168" width="400" height="62" rx="31" fill="#082F36"/>
    ${letterPaths("COLOR · PRINT · CREATE",{x:500,y:1208,fontSize:23,maxWidth:360,color:"#FFFFFF",align:"center"})}

    <rect x="65" y="1282" width="870" height="158" rx="34" fill="#FFFFFF"/>
    ${letterPaths("CraftColoring",{x:101,y:1336,fontSize:34,maxWidth:420,color:"#0B3C45"})}
    <rect x="95" y="1360" width="350" height="48" rx="24" fill="#0B3C45"/>
    ${letterPaths(cat || "COLORING PAGES",{x:270,y:1391,fontSize:20,maxWidth:310,color:"#FFFFFF",align:"center"})}
    <rect x="520" y="1310" width="300" height="72" rx="36" fill="#F8D84E"/>
    ${letterPaths("CRAFTCOLORING.COM",{x:670,y:1355,fontSize:22,maxWidth:270,color:"#103A41",align:"center"})}

    <circle cx="894" cy="1274" r="61" fill="#F27765" stroke="#FFFFFF" stroke-width="7"/>
    ${letterPaths("FREE",{x:894,y:1267,fontSize:23,maxWidth:88,color:"#FFFFFF",align:"center"})}
    ${letterPaths("TO PRINT",{x:894,y:1295,fontSize:15,maxWidth:92,color:"#FFFFFF",align:"center"})}
  </svg>`;

  // Keep original pixels: shrink large artwork to fit, but never upscale small artwork.
  const { data: illustration, info: illustrationInfo } = await sharp(source, { limitInputPixels: 40_000_000 })
    .rotate().flatten({ background: "#FFFFFF" })
    .resize(ART.width, ART.height, { fit: "contain", background: "#FFFFFF", withoutEnlargement: true })
    .png().toBuffer({ resolveWithObject: true });
  const left = ART.x + Math.round((ART.width - illustrationInfo.width) / 2);
  const top = ART.y + Math.round((ART.height - illustrationInfo.height) / 2);
  return sharp(Buffer.from(svg))
    .composite([{ input: illustration, left, top }])
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
