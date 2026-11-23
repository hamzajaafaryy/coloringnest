import { getAllPublishedColoringPagesWithCategory } from "@/db/queries";
import { buildCanonicalUrl, SITE_CONFIG } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function xml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absoluteUrl(value: string): string | null {
  try {
    const url = new URL(value, SITE_CONFIG.domain);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch { return null; }
}

function imageMimeType(url: string): string {
  const path = new URL(url).pathname.toLowerCase();
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

export async function GET() {
  const pages = await getAllPublishedColoringPagesWithCategory();
  const items = pages.flatMap((page) => {
    if (!page.slug || !page.categorySlug || !page.imageUrl) return [];
    const image = absoluteUrl(page.imageUrl);
    if (!image) return [];
    const link = buildCanonicalUrl("/coloring-pages/" + encodeURIComponent(page.categorySlug) + "/" + encodeURIComponent(page.slug));
    const title = page.title?.trim() || "Free Printable Coloring Page";
    const description = (page.seoDescription || page.description || page.altText || title).trim();
    const publishedAt = page.publishedAt || page.updatedAt || new Date(0);
    return ["    <item>",
      "      <title>" + xml(title) + "</title>",
      "      <description>" + xml(description) + "</description>",
      "      <link>" + xml(link) + "</link>",
      "      <guid isPermaLink=\"true\">" + xml(link) + "</guid>",
      "      <pubDate>" + xml(publishedAt instanceof Date ? publishedAt.toUTCString() : new Date(publishedAt).toUTCString()) + "</pubDate>",
      "      <enclosure url=\"" + xml(image) + "\" type=\"" + imageMimeType(image) + "\" length=\"0\" />",
      "      <media:content url=\"" + xml(image) + "\" medium=\"image\" />",
      "    </item>"].join("\n");
  });
  const feed = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">',
    "  <channel>",
    "    <title>" + xml(SITE_CONFIG.name) + " - Free Printable Coloring Pages</title>",
    "    <link>" + xml(SITE_CONFIG.domain) + "</link>",
    "    <description>" + xml(SITE_CONFIG.defaultDescription) + "</description>",
    "    <language>en-us</language>",
    "    <lastBuildDate>" + xml(new Date().toUTCString()) + "</lastBuildDate>",
    ...items,
    "  </channel>",
    "</rss>",
  ].join("\n");
  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
