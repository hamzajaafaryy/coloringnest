import { and, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { categories, coloringPages } from "@/db/schema";
import { getAllPublishedCategories } from "@/db/queries";
import { canonicalCategorySlug } from "@/lib/category-catalog";
import { SITE_CONFIG } from "@/lib/seo";
import { buildPinterestRssFeed } from "@/lib/pinterest-rss";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ category: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { category: requestedCategory } = await params;
  const isAllCategories = requestedCategory.toLowerCase() === "all";
  const catalog = await getAllPublishedCategories();

  const category = isAllCategories
    ? null
    : catalog.find((entry) => entry.slug === canonicalCategorySlug(requestedCategory));

  // Unknown category slugs should not silently return every coloring page.
  if (!isAllCategories && !category) {
    return new Response("RSS category not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const sourceCategoryIds = category?.sourceIds;
  const conditions = [
    eq(coloringPages.isPublished, true),
    isNotNull(coloringPages.imageUrl),
    isNotNull(coloringPages.slug),
    isNotNull(categories.slug),
  ];

  if (sourceCategoryIds) {
    conditions.push(inArray(coloringPages.categoryId, sourceCategoryIds));
  }

  const rows = await db
    .select({
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
    })
    .from(coloringPages)
    .innerJoin(categories, eq(coloringPages.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(coloringPages.publishedAt), desc(coloringPages.id))
    .limit(50);

  const canonicalCategoryById = new Map<number, { name: string; slug: string }>();
  for (const entry of catalog) {
    for (const id of entry.sourceIds) {
      canonicalCategoryById.set(id, { name: entry.name, slug: entry.slug });
    }
  }

  // Pinterest processes feed items oldest-first. Keep the newest 50 and
  // emit them oldest-first so newly published pages are discovered correctly.
  const items = rows.reverse().map((row) => {
    const canonical = canonicalCategoryById.get(row.categorySlug ? (
      catalog.find((entry) => entry.sourceIds.includes(
        // Resolve the database category through its joined slug below.
        entry.sourceIds[0] ?? -1
      ))?.sourceIds[0] ?? -1
    ) : -1);

    return {
      ...row,
      slug: row.slug!,
      categoryName: category?.name || row.categoryName,
      categorySlug: category?.slug || row.categorySlug,
      sheets: [],
    };
  });

  const xml = buildPinterestRssFeed(items, SITE_CONFIG.domain);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
