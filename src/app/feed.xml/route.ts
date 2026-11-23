import { and, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { categories, coloringPages } from "@/db/schema";
import { SITE_CONFIG } from "@/lib/seo";
import { buildPinterestRssFeed } from "@/lib/pinterest-rss";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select({
    id: coloringPages.id,
    title: coloringPages.title,
    slug: coloringPages.slug,
    imageUrl: coloringPages.imageUrl,
    description: coloringPages.description,
    seoDescription: coloringPages.seoDescription,
    altText: coloringPages.altText,
    categoryName: categories.name,
    categorySlug: categories.slug,
    publishedAt: coloringPages.publishedAt,
  }).from(coloringPages)
    .leftJoin(categories, eq(coloringPages.categoryId, categories.id))
    .where(and(
      eq(coloringPages.isPublished, true),
      isNotNull(coloringPages.imageUrl),
      isNotNull(coloringPages.slug),
      isNotNull(categories.slug),
    ))
    .orderBy(desc(coloringPages.publishedAt), desc(coloringPages.id))
    .limit(50);

  // Pinterest processes the oldest items first. Keep a bounded, rolling set
  // of the 50 newest raster-backed pages, ordered oldest to newest in the feed.
  const items = rows.reverse().map((row) => ({
    ...row,
    slug: row.slug!,
    sheets: [],
  }));

  const xml = buildPinterestRssFeed(items, SITE_CONFIG.domain);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
