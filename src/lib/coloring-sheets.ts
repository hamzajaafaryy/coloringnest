export const MAX_COLLECTION_SHEETS = 12;
export interface ColoringSheet {
  id: string;
  title: string;
  altText: string;
  imageUrl: string | null;
  svgUrl: string | null;
  svgContent?: string | null;
}

export function primarySheet(page: { title: string; altText: string | null; imageUrl: string | null; svgUrl?: string | null; svgContent?: string | null }): ColoringSheet {
  return { id: "cover", title: page.title, altText: page.altText || page.title, imageUrl: page.imageUrl, svgUrl: page.svgUrl || null, svgContent: page.svgContent };
}

export function parseSheetInputs(value: unknown, storageOrigin: string): ColoringSheet[] {
  if (!Array.isArray(value) || value.length >= MAX_COLLECTION_SHEETS) throw new Error("Add at most 11 additional sheets (12 including the cover).");
  const ids = new Set<string>();
  const origin = new URL(storageOrigin).origin;
  function asset(value: unknown, folder: string) {
    if (value === "" || value == null) return null;
    if (typeof value !== "string" || value.length > 2048) throw new Error("Invalid artwork URL.");
    const url = new URL(value);
    if (url.origin !== origin || !url.pathname.startsWith(`/storage/v1/object/public/coloring-pages/${folder}/`) || url.search || url.hash) throw new Error("Upload artwork using the image upload control.");
    return url.href;
  }
  return value.map((entry) => {
    if (!entry || typeof entry !== "object") throw new Error("Invalid sheet.");
    const { id, title, altText } = entry;
    if (typeof id !== "string" || !/^[a-f0-9-]{36}$/.test(id) || ids.has(id)) throw new Error("Invalid or duplicate sheet ID.");
    ids.add(id);
    if (typeof title !== "string" || !title.trim() || title.length > 160) throw new Error("Each sheet needs a title of up to 160 characters.");
    if (typeof altText !== "string" || !altText.trim() || altText.length > 500) throw new Error("Each sheet needs descriptive alt text (up to 500 characters).");
    const imageUrl = asset(entry.imageUrl, "images");
    const svgUrl = asset(entry.svgUrl, "svg");
    if (!imageUrl) throw new Error("Upload a printable image for each additional sheet.");
    return { id, title: title.trim(), altText: altText.trim(), imageUrl, svgUrl };
  });
}

export function sheetEditorUrl(slug: string, id: string) {
  return `/color-online/${encodeURIComponent(slug)}/${id === "cover" ? "" : `?sheet=${encodeURIComponent(id)}`}`;
}
