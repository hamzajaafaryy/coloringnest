/** Shared, deterministic Pinterest metadata. No paid LLM or fake ranking claims. */
import { canonicalCategorySlug } from "./category-catalog";

export const PIN_SIZE = { width: 1000, height: 1500 } as const;
export const PIN_TEMPLATES = ["editorial", "lilac", "sunshine", "midnight", "papercut"] as const;
export type PinTemplate = (typeof PIN_TEMPLATES)[number];

export type PinArtwork = {
  id: number;
  title: string;
  slug: string;
  categoryName: string | null;
  categorySlug: string | null;
  imageUrl: string | null;
  altText: string | null;
  description: string | null;
  seoDescription: string | null;
  sheets: { id: string; title: string; altText: string; imageUrl: string }[];
};

export type PinSeo = {
  title: string;
  description: string;
  altText: string;
  board: string;
  destination: string;
  headline: string;
};

export function normalizePinText(input: string | null | undefined): string {
  return (input || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function clampPinText(value: string, max: number): string {
  const text = normalizePinText(value);
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1).replace(/\s+\S*$/, "");
  return (cut || text.slice(0, max - 1)).trimEnd() + "…";
}

export function pinBoard(category: string | null | undefined): string {
  const key = (category || "").toLowerCase();
  if (/christmas/.test(key)) return "Christmas Coloring Pages";
  if (/halloween/.test(key)) return "Halloween Coloring Pages";
  if (/princess|fairy|fantasy/.test(key)) return "Princess & Fairy Tale Coloring Pages";
  if (/animal|ocean/.test(key)) return "Animal Coloring Pages";
  if (/dinosaur/.test(key)) return "Dinosaur Coloring Pages";
  if (/unicorn/.test(key)) return "Unicorn Coloring Pages";
  if (/flower|nature|garden/.test(key)) return "Nature & Flower Coloring Pages";
  if (/preschool|kindergarten|toddler/.test(key)) return "Easy Coloring Pages for Kids";
  if (/adult|mandala/.test(key)) return "Relaxing Coloring Pages";
  if (/vehicle|car/.test(key)) return "Vehicle Coloring Pages";
  return "Free Printable Coloring Pages";
}

export function pinArtworkForSheet(item: PinArtwork, sheetId = "cover") {
  const sheet = item.sheets.find((one) => one.id === sheetId);
  return {
    imageUrl: sheet?.imageUrl || item.imageUrl,
    title: sheet?.title || item.title,
    altText: sheet?.altText || item.altText,
  };
}

export function makePinSeo(
  item: PinArtwork,
  siteOrigin: string,
  template: PinTemplate = "editorial",
  sheetId = "cover",
): PinSeo {
  const artwork = pinArtworkForSheet(item, sheetId);
  const named = normalizePinText(artwork.title || item.title).replace(/\s*\|\s*CraftColoring$/i, "");
  const cleanTitle = /coloring pages?/i.test(named) ? named : named + " Coloring Page";
  const title = clampPinText(cleanTitle.replace(/\s*-\s*free printable/i, "") + " | Free Printable", 100);
  const summary = normalizePinText(item.seoDescription || item.description);
  // The first sentence describes the real page; no invented search volume,
  // educational outcomes, commercial guarantees or repetitive hashtags.
  const first = summary.split(/(?<=[.!?])\s+/)[0] || "";
  const description = clampPinText(
    [first && first.length < 190 ? first : "Discover this " + cleanTitle.toLowerCase() + ".",
      "Print this free coloring sheet or color online at CraftColoring.",
      "Save this Pin for a fun creative activity at home or in class."].join(" "),
    500,
  );
  const altText = clampPinText(
    artwork.altText || "Black-and-white outline artwork for " + cleanTitle.toLowerCase() + ".",
    500,
  );
  const category = canonicalCategorySlug(item.categorySlug || "");
  const slug = encodeURIComponent(item.slug);
  const path = "/coloring-pages/" + encodeURIComponent(category || "uncategorized") + "/" + slug;
  const origin = siteOrigin.replace(/\/$/, "");
  const url = new URL(path, origin + "/");
  url.searchParams.set("utm_source", "pinterest");
  url.searchParams.set("utm_medium", "organic");
  url.searchParams.set("utm_campaign", "craftcoloring_pins");
  url.searchParams.set("utm_content", clampPinText(item.slug + "-" + template + "-" + sheetId, 120));
  return {
    title, description, altText,
    board: pinBoard(item.categoryName),
    destination: url.toString(),
    headline: clampPinText(cleanTitle, 76),
  };
}

export function isPinTemplate(value: unknown): value is PinTemplate {
  return typeof value === "string" && (PIN_TEMPLATES as readonly string[]).includes(value);
}

export function safePinName(item: PinArtwork, template: PinTemplate, sheetId = "cover") {
  const slug = (item.slug || String(item.id)).replace(/[^a-z0-9-]/gi, "-").slice(0, 70);
  const sheet = sheetId.replace(/[^a-z0-9-]/gi, "-").slice(0, 32);
  return "craftcoloring-" + slug + "-" + sheet + "-" + template + ".png";
}

export function xmlEscape(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[c] || c);
}

export function wrapPinHeadline(value: string, maxChars = 23, maxLines = 3): string[] {
  const words = normalizePinText(value).split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? current + " " + word : word;
    if (next.length <= maxChars || !current) current = next;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    const joined = lines.slice(maxLines - 1).join(" ");
    return [...lines.slice(0, maxLines - 1), clampPinText(joined, maxChars * 2)];
  }
  return lines.length ? lines : ["Free Coloring Page"];
}
