import { sanitizeSvg } from "../sanitize-svg";

const MAX_SVG_BYTES = 2 * 1024 * 1024;

/** Only retrieve artwork from this application's public upload bucket. */
export async function resolveColoringSvg(page: {
  svgContent?: string | null;
  svgUrl?: string | null;
}): Promise<string> {
  if (page.svgContent?.trim()) {
    try { return sanitizeSvg(page.svgContent); } catch { /* Try the uploaded file. */ }
  }
  if (!page.svgUrl || !process.env.SUPABASE_URL) return "";

  try {
    const url = new URL(page.svgUrl);
    const storage = new URL(process.env.SUPABASE_URL);
    if (url.protocol !== "https:" || url.origin !== storage.origin ||
        url.username || url.password ||
        !url.pathname.startsWith("/storage/v1/object/public/coloring-pages/")) return "";

    const response = await fetch(url, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok || !response.body) return "";
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let bytes = 0;
    let svg = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > MAX_SVG_BYTES) {
          await reader.cancel();
          return "";
        }
        svg += decoder.decode(value, { stream: true });
      }
    } finally {
      reader.releaseLock();
    }
    return sanitizeSvg(svg + decoder.decode());
  } catch {
    return "";
  }
}
