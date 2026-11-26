import sharp from "sharp";
import { isPinTemplate, type PinTemplate } from "./pinterest-studio.ts";
import { letterPaths, titleLetterPaths } from "./pinterest-lettering.ts";

type RenderOptions = {
  template: PinTemplate;
  headline: string;
  category?: string | null;
  image: Buffer | Uint8Array;
};

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

  // One consistent CraftColoring identity, adapted from the supplied Baby Hippo reference.
  const bg = "#0E7C86";
  const deep = "#0B2F33";
  const teal = "#12929B";
  const yellow = "#FFD95A";
  const coral = "#FF6B4A";
  const white = "#FFFFFF";
  const title = headline.replace(/\\s+/g, " ").trim().slice(0, 76) || "Free Printable Coloring Page";
  const rawCategory = (category || "Coloring").trim().replace(/\\s+coloring pages?$/i, "");
  const categoryLabel = (rawCategory || "Coloring").slice(0, 34) + " Coloring Pages";
  const titlePaths = titleLetterPaths(title, white);
  const titleShadow = titleLetterPaths(title, deep);
  const artW = 540, artH = 610;
  const artX = 230, artY = 560;
  const cat = categoryLabel.replace(/\\s+/g, " ").slice(0, 42);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1500" viewBox="0 0 1000 1500">
    <rect width="1000" height="1500" fill="${bg}"/>
    <ellipse cx="500" cy="20" rx="520" ry="350" fill="${teal}"/>
    <circle cx="-5" cy="625" r="70" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="8"/>
    <circle cx="74" cy="740" r="32" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="6"/>
    <circle cx="1010" cy="1020" r="60" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="8"/>
    <circle cx="920" cy="1160" r="25" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="6"/>
    <path d="M92 88l13 34 34 13-34 13-13 34-13-34-34-13 34-13z" fill="${yellow}"/>
    <path d="M904 328l10 25 25 10-25 10-10 25-10-25-25-10 25-10z" fill="${coral}"/>
    <path d="M80 1200l11 27 27 11-27 11-11 27-11-27-27-11 27-11z" fill="${yellow}"/>

    <rect x="286" y="54" width="428" height="58" rx="29" fill="${yellow}" transform="rotate(-2 500 83)"/>
    ${letterPaths("PRINTABLE COLORING PAGE",{x:500,y:92,fontSize:23,maxWidth:390,color:deep,align:"center"})}
    <g transform="translate(0 7)">${titleShadow}</g>
    ${titlePaths}
    ${letterPaths(cat,{x:500,y:442,fontSize:43,maxWidth:840,color:yellow,align:"center"})}

    <rect x="208" y="540" width="600" height="665" rx="44" fill="${yellow}" />
    <rect x="190" y="520" width="600" height="665" rx="44" fill="${white}" stroke="${deep}" stroke-width="7"/>
    <rect x="216" y="546" width="548" height="613" rx="24" fill="#FFFFFF"/>
    <circle cx="814" cy="496" r="87" fill="${coral}" stroke="${deep}" stroke-width="7"/>
    <g transform="translate(814 484)">
      ${letterPaths("FREE",{x:0,y:0,fontSize:53,maxWidth:145,color:deep,align:"center"})}
      ${letterPaths("TO PRINT",{x:0,y:38,fontSize:23,maxWidth:140,color:deep,align:"center"})}
    </g>

    <rect x="160" y="1220" width="300" height="58" rx="29" fill="${deep}"/>
    ${letterPaths("PRINT AT HOME",{x:310,y:1257,fontSize:22,maxWidth:260,color:white,align:"center"})}
    <rect x="478" y="1220" width="362" height="58" rx="29" fill="${deep}"/>
    ${letterPaths("LETTER & A4",{x:659,y:1257,fontSize:22,maxWidth:320,color:white,align:"center"})}

    <rect x="56" y="1332" width="888" height="116" rx="58" fill="${white}" stroke="${deep}" stroke-width="6"/>
    <rect x="56" y="1440" width="888" height="8" rx="4" fill="${deep}"/>
    ${letterPaths("CraftColoring",{x:94,y:1388,fontSize:38,maxWidth:390,color:deep})}
    ${letterPaths(categoryLabel.slice(0,30),{x:94,y:1423,fontSize:20,maxWidth:390,color:"#0B6B73"})}
    <rect x="622" y="1356" width="292" height="66" rx="33" fill="${coral}"/>
    ${letterPaths("craftcoloring.com",{x:768,y:1399,fontSize:25,maxWidth:265,color:"#2A0F00",align:"center"})}
  </svg>`;

  // Keep the original coloring artwork intact; only scale it to fit the reference frame.
  const { data: illustration, info: illustrationInfo } = await sharp(source, {limitInputPixels: 40_000_000})
    .rotate().flatten({ background: "#FFFFFF" })
    .resize(artW, artH, { fit: "contain", background: "#FFFFFF", withoutEnlargement: true })
    .png().toBuffer({ resolveWithObject: true });
  const left = artX + Math.round((artW - illustrationInfo.width) / 2);
  const top = artY + Math.round((artH - illustrationInfo.height) / 2);
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
