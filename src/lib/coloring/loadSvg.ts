import "server-only";
import { sanitizeSvg } from "@/lib/sanitize-svg";

const MAX_SVG_BYTES = 2 * 1024 * 1024;

/**
 * Load only SVGs from this project's public Supabase coloring-pages bucket.
 * Never make a server request to an arbitrary URL entered in the admin.
 */
export async function loadColoringSvg(svgUrl: string | null | undefined): Promise<string> {
  if (!svgUrl || !process.env.SUPABASE_URL) return "";

  try {
    const source = new URL(svgUrl);
    const supabase = new URL(process.env.SUPABASE_URL);
    if (
      source.origin !== supabase.origin ||
      !source.pathname.startsWith("/storage/v1/object/public/coloring-pages/svg/") ||
      !source.pathname.toLowerCase().endsWith(".svg") ||
      source.search ||
      source.hash
    ) return "";

    const response = await fetch(source.toString(), {
      cache: "force-cache",
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok || !response.body) return "";

    const length = Number(response.headers.get("content-length") || "0");
    if (length > MAX_SVG_BYTES) return "";

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_SVG_BYTES) {
        await reader.cancel();
        return "";
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return sanitizeSvg(new TextDecoder().decode(bytes));
  } catch (error) {
    console.error("Could not load coloring SVG:", error);
    return "";
  }
}
