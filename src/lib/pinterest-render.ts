import sharp from "sharp";
import type { PinTemplate } from "./pinterest-studio.ts";
import { letterPaths } from "./pinterest-lettering.ts";
import { wrapPinHeadline } from "./pinterest-studio.ts";

type RenderOptions = {
  template: PinTemplate;
  headline: string;
  category?: string | null;
  image: Buffer | Uint8Array;
};

/**
 * One fixed CraftColoring Pinterest identity for every Pin.
 * The original artwork pixels are composited unchanged; only the presentation
 * frame and surrounding brand artwork are generated here.
 */
export async function renderPinterestPin({
  headline, category, image,
}: RenderOptions): Promise<Buffer> {
  const source = Buffer.from(image);
  if (!source.length || source.length > 18 * 1024 * 1024) throw new Error("Artwork image is too large");
  const metadata = await sharp(source, { limitInputPixels: 40_000_000, failOn: "error" }).metadata();
  if (!metadata.width || !metadata.height || !["png", "jpeg", "webp", "avif"].includes(metadata.format || "")) {
    throw new Error("A PNG, JPEG, WebP or AVIF artwork image is required");
  }

  const teal = "#138F98";
  const tealDark = "#0B2F33";
  const tealLight = "#20A0A6";
  const yellow = "#FFD95A";
  const orange = "#FF6B4A";
  const title = headline.replace(/\\s+/g, " ").trim().slice(0, 90) || "Free Printable Coloring Page";
  const lines = wrapPinHeadline(title.replace(/\\s*\\|\\s*Free Printable$/i, ""), 20, 3);
  const titleSize = lines.length >= 3 ? 76 : 94;
  const titleStart = lines.length >= 3 ? 184 : lines.length === 2 ? 218 : 265;
  const titleMarkup = lines.map((line, index) => {
    const y = titleStart + index * (titleSize + 7);
    return letterPaths(line, { x: 500, y: y + 8, fontSize: titleSize, maxWidth: 850, color: tealDark, align: "center" }) +
      letterPaths(line, { x: 500, y, fontSize: titleSize, maxWidth: 850, color: "#FFFFFF", align: "center" });
  }).join("");
  const cat = (category || "Coloring Pages").replace(/\\s+/g, " ").trim().slice(0, 34);
  const subtitleY = lines.length >= 3 ? 420 : lines.length === 2 ? 405 : 390;
  const subtitle = letterPaths(cat, { x: 500, y: subtitleY, fontSize: 47, maxWidth: 820, color: yellow, align: "center" });

  const cardWidth = 650, cardHeight = 820;
  const artWidth = 590, artHeight = 760;
  const { data: illustration, info } = await sharp(source, { limitInputPixels: 40_000_000 })
    .rotate().flatten({ background: "#FFFFFF" })
    .resize(artWidth, artHeight, { fit: "contain", background: "#FFFFFF", withoutEnlargement: true })
    .png().toBuffer({ resolveWithObject: true });
  const cardSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
    <rect x="8" y="8" width="634" height="804" rx="42" fill="#FFFFFF" stroke="${tealDark}" stroke-width="7"/>
    <rect x="26" y="25" width="598" height="770" rx="25" fill="#FFFFFF"/>
  </svg>`);
  const cardLeft = 30 + Math.round((artWidth - info.width) / 2);
  const cardTop = 30 + Math.round((artHeight - info.height) / 2);
  const card = await sharp(cardSvg).composite([{ input: illustration, left: cardLeft, top: cardTop }])
    .png().toBuffer();
  const tiltedCard = await sharp(card).rotate(-2, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

  const footerCategory = cat.length ? (/coloring pages?$/i.test(cat) ? cat : cat + " Coloring Pages") : "Free Coloring Pages";
  const backgroundSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">
    <rect width="1000" height="1500" fill="${teal}"/>
    <path d="M0 0H1000V360Q770 510 500 465Q180 420 0 270Z" fill="${tealLight}" opacity=".48"/>
    <path d="M92 70l13 29 30 13-30 12-13 30-12-30-30-12 30-13z" fill="${yellow}"/>
    <path d="M920 330l10 23 24 10-24 10-10 24-10-24-24-10 24-10z" fill="${orange}"/>
    <path d="M80 1190l13 29 30 13-30 12-13 30-12-30-30-12 30-13z" fill="${yellow}"/>
    <circle cx="18" cy="640" r="72" fill="none" stroke="#72C4C8" stroke-width="9" opacity=".85"/>
    <circle cx="92" cy="735" r="35" fill="none" stroke="#72C4C8" stroke-width="8" opacity=".8"/>
    <circle cx="970" cy="1060" r="65" fill="none" stroke="#72C4C8" stroke-width="9" opacity=".8"/>
    <circle cx="925" cy="1150" r="29" fill="none" stroke="#72C4C8" stroke-width="8" opacity=".8"/>

    <rect x="224" y="58" width="552" height="62" rx="31" fill="${yellow}" transform="rotate(-2 500 89)"/>
    ${letterPaths("FREE PRINTABLE COLORING PAGE",{x:500,y:99,fontSize:24,maxWidth:510,color:tealDark,align:"center"})}
    ${titleMarkup}
    ${subtitle}

    <rect x="55" y="1320" width="890" height="112" rx="56" fill="${tealDark}" opacity=".95"/>
    <rect x="60" y="1310" width="880" height="112" rx="56" fill="#FFFFFF" stroke="${tealDark}" stroke-width="6"/>
    ${letterPaths("CraftColoring",{x:101,y:1373,fontSize:38,maxWidth:430,color:tealDark})}
    ${letterPaths(footerCategory,{x:102,y:1404,fontSize:20,maxWidth:430,color:"#0B6B73"})}
    <rect x="610" y="1330" width="293" height="72" rx="36" fill="${orange}"/>
    ${letterPaths("craftcoloring.com",{x:756,y:1377,fontSize:27,maxWidth:270,color:"#2A0F00",align:"center"})}

  </svg>`);

  const badgeSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">
    <circle cx="758" cy="492" r="91" fill="${tealDark}"/>
    <circle cx="758" cy="484" r="87" fill="${orange}" stroke="${tealDark}" stroke-width="7"/>
    ${letterPaths("FREE",{x:758,y:488,fontSize:53,maxWidth:145,color:tealDark,align:"center"})}
    ${letterPaths("TO PRINT",{x:758,y:526,fontSize:25,maxWidth:145,color:tealDark,align:"center"})}
  </svg>`);
  return sharp(backgroundSvg)
    .composite([{ input: tiltedCard, left: 175, top: 465 }, { input: badgeSvg }])
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
      !/\\.(png|jpe?g|webp|avif)$/i.test(image.pathname)) {
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
