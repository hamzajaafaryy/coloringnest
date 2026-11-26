import { getPinterestArtwork } from "@/lib/pinterest-data";
import { fetchPinterestArtworkImage, renderPinterestPin } from "@/lib/pinterest-render";
import { makePinSeo, pinArtworkForSheet } from "@/lib/pinterest-studio";
import { SITE_CONFIG } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const item = await getPinterestArtwork(id);
    if (!item) return new Response("Not found", { status: 404 });
    const artwork = pinArtworkForSheet(item, "cover");
    if (!artwork.imageUrl) return new Response("Image not found", { status: 404 });

    const seo = makePinSeo(item, SITE_CONFIG.domain, "editorial");
    const image = await fetchPinterestArtworkImage(artwork.imageUrl);
    const rendered = await renderPinterestPin({
      template: "editorial",
      headline: seo.headline,
      category: item.categoryName,
      image,
    });

    return new Response(new Uint8Array(rendered), {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(rendered.length),
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Public Pinterest image render failed", error);
    return new Response("Unable to render Pin image", { status: 500 });
  }
}
