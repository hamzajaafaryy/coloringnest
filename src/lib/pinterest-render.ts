import sharp from "sharp";
import { isPinTemplate, type PinTemplate } from "./pinterest-studio.ts";

type RenderOptions = {
  template: PinTemplate;
  headline: string;
  category?: string | null;
  image: Buffer | Uint8Array;
};

function xml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function wrapTitle(value: string, maxChars = 18): string[] {
  const words = value.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (line && next.length > maxChars) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  if (lines.length > 2) {
    const joined = lines.slice(1).join(" ");
    lines.splice(1, lines.length - 1, joined);
  }
  return lines;
}

/**
 * Render the CraftColoring Signature Pinterest pin.
 * The composition follows the supplied 1000×1500 Baby Hippo design reference:
 * teal canvas, Fredoka-style headline, rotated white artwork card, coral print
 * sticker, three dark feature pills, and the white branded footer.
 */
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

  const bg = "#0E7C86";
  const teal = "#12929B";
  const ink = "#0B2F33";
  const yellow = "#FFD95A";
  const coral = "#FF6B4A";
  const white = "#FFFFFF";
  const title = headline.replace(/\s+/g, " ").trim().slice(0, 58) || "Free Printable Coloring Page";
  const rawCategory = (category || "Coloring").trim().replace(/\s+coloring pages?$/i, "").slice(0, 32) || "Coloring";
  const subtitle = rawCategory + " Coloring Pages";
  const lines = wrapTitle(title);
  const titleSize = lines.some(line => line.length > 15) ? 88 : 104;
  const titleMarkup = lines.map((line, index) =>
    `<text x="500" y="${188 + index * (titleSize * 0.98)}" text-anchor="middle" font-family="Fredoka, DejaVu Sans, sans-serif" font-size="${titleSize}" font-weight="700" fill="${white}" stroke="${ink}" stroke-width="0" style="paint-order:stroke;filter:url(#titleShadow)">${xml(line)}</text>`
  ).join("");

  const artWidth = 540;
  const artHeight = Math.min(670, Math.max(360, Math.round(artWidth * metadata.height / metadata.width)));
  const cardX = 201;
  const cardY = 510;
  const cardWidth = 598;
  const cardHeight = artHeight + 58;
  const resized = await sharp(source, { limitInputPixels: 40_000_000 })
    .rotate()
    .flatten({ background: white })
    .resize(artWidth, artHeight, { fit: "contain", background: white, withoutEnlargement: false })
    .png()
    .toBuffer();
  const artMeta = await sharp(resized).metadata();
  const imageX = cardX + 29 + Math.round((artWidth - (artMeta.width || artWidth)) / 2);
  const imageY = cardY + 29 + Math.round((artHeight - (artMeta.height || artHeight)) / 2);
  const imageBase64 = resized.toString("base64");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1000" height="1500" viewBox="0 0 1000 1500">
    <defs>
      <filter id="titleShadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="7" stdDeviation="0" flood-color="${ink}"/></filter>
      <clipPath id="artClip"><rect x="${imageX}" y="${imageY}" width="${artMeta.width || artWidth}" height="${artMeta.height || artHeight}" rx="22"/></clipPath>
    </defs>
    <rect width="1000" height="1500" fill="${bg}"/>
    <ellipse cx="500" cy="150" rx="520" ry="350" fill="${teal}"/>
    <circle cx="-5" cy="630" r="70" fill="none" stroke="${white}" stroke-opacity=".35" stroke-width="8"/>
    <circle cx="68" cy="732" r="32" fill="none" stroke="${white}" stroke-opacity=".35" stroke-width="6"/>
    <circle cx="1010" cy="1040" r="60" fill="none" stroke="${white}" stroke-opacity=".35" stroke-width="8"/>
    <circle cx="925" cy="1160" r="25" fill="none" stroke="${white}" stroke-opacity=".35" stroke-width="6"/>
    <path d="M80 70 L92 105 L127 117 L92 129 L80 164 L68 129 L33 117 L68 105 Z" fill="${yellow}"/>
    <path d="M920 310 L930 337 L957 347 L930 357 L920 384 L910 357 L883 347 L910 337 Z" fill="#FF8A65"/>
    <path d="M80 1190 L91 1218 L119 1229 L91 1240 L80 1268 L69 1240 L41 1229 L69 1218 Z" fill="${yellow}"/>

    <rect x="320" y="58" width="360" height="54" rx="27" fill="${yellow}" transform="rotate(-2 500 85)"/>
    <text x="500" y="94" text-anchor="middle" font-family="Nunito, DejaVu Sans, sans-serif" font-size="22" font-weight="800" letter-spacing="2.5" fill="${ink}">PRINTABLE COLORING PAGE</text>
    ${titleMarkup}
    <text x="500" y="${lines.length === 1 ? 330 : 410}" text-anchor="middle" font-family="Fredoka, DejaVu Sans, sans-serif" font-size="48" font-weight="600" fill="${yellow}">${xml(subtitle)}</text>

    <g transform="rotate(-2 500 ${cardY + cardHeight / 2})">
      <rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="44" fill="${white}" stroke="${ink}" stroke-width="7"/>
      <image x="${imageX}" y="${imageY}" width="${artMeta.width || artWidth}" height="${artMeta.height || artHeight}" xlink:href="data:image/png;base64,${imageBase64}" clip-path="url(#artClip)"/>
    </g>

    <g transform="rotate(14 809 496)">
      <circle cx="809" cy="496" r="86" fill="${coral}" stroke="${ink}" stroke-width="7"/>
      <text x="809" y="488" text-anchor="middle" font-family="Fredoka, DejaVu Sans, sans-serif" font-size="52" font-weight="700" fill="${ink}">FREE</text>
      <text x="809" y="524" text-anchor="middle" font-family="Fredoka, DejaVu Sans, sans-serif" font-size="25" font-weight="700" fill="${ink}">TO PRINT</text>
    </g>

    <g font-family="Nunito, DejaVu Sans, sans-serif" font-size="22" font-weight="800" fill="${white}" text-anchor="middle">
      <rect x="86" y="1240" width="250" height="58" rx="29" fill="${ink}"/>
      <text x="211" y="1277">FREE PDF</text>
      <rect x="355" y="1240" width="290" height="58" rx="29" fill="${ink}"/>
      <text x="500" y="1277">PRINT AT HOME</text>
      <rect x="664" y="1240" width="250" height="58" rx="29" fill="${ink}"/>
      <text x="789" y="1277">LETTER &amp; A4</text>
    </g>

    <rect x="56" y="1332" width="888" height="116" rx="58" fill="${white}" stroke="${ink}" stroke-width="6"/>
    <rect x="56" y="1440" width="888" height="8" rx="4" fill="${ink}"/>
    <text x="96" y="1390" font-family="Fredoka, DejaVu Sans, sans-serif" font-size="38" font-weight="700" fill="${ink}">CraftColoring</text>
    <text x="96" y="1423" font-family="Nunito, DejaVu Sans, sans-serif" font-size="19" font-weight="800" fill="#0B6B73">${xml(subtitle.slice(0, 30))}</text>
    <rect x="622" y="1356" width="292" height="66" rx="33" fill="${coral}"/>
    <text x="768" y="1399" text-anchor="middle" font-family="Nunito, DejaVu Sans, sans-serif" font-size="25" font-weight="800" fill="#2A0F00">craftcoloring.com</text>
  </svg>`;

  return sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, effort: 7 })
    .toBuffer();
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
