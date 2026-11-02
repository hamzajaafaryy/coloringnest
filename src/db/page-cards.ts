import { and, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "./index";
import { categories, coloringPages } from "./schema";
import { canonicalCategorySlug, categorySlugs } from "@/lib/category-catalog";
import { getAllPublishedCategories } from "./queries";

export const CARD_PAGE_SIZE = 24;

// A grid needs only a preview, not entire article bodies or raster-backed SVG blobs.
// Preserve embedded SVG for legacy drawings without a PNG image.
const fields = {
  id: coloringPages.id, title: coloringPages.title, slug: coloringPages.slug,
  description: sql<string | null>`left(${coloringPages.description}, 155)`,
  seoDescription: coloringPages.seoDescription,
  imageUrl: coloringPages.imageUrl, svgUrl: coloringPages.svgUrl,
  svgContent: sql<string | null>`case when nullif(${coloringPages.imageUrl}, '') is null then ${coloringPages.svgContent} else null end`,
  altText: coloringPages.altText, categoryId: coloringPages.categoryId,
  categoryName: categories.name, categorySlug: categories.slug,
  ageRange: coloringPages.ageRange, difficulty: coloringPages.difficulty,
  featured: coloringPages.featured, popular: coloringPages.popular,
  publishedAt: coloringPages.publishedAt,
};

export async function getPublishedCardPage({
  page = 1, limit = CARD_PAGE_SIZE, categorySlug, query,
  onlineOnly = false, sort = "featured",
}: {
  page?: number; limit?: number; categorySlug?: string; query?: string;
  onlineOnly?: boolean; sort?: "featured" | "newest";
} = {}) {
  const size = Math.min(48, Math.max(1, Math.trunc(limit) || CARD_PAGE_SIZE));
  const requestedPage = Math.min(10000, Math.max(1, Math.trunc(page) || 1));
  const term = (query || "").trim().slice(0, 80);
  const searchPattern = "%" + term.replace(/[%_\\]/g, char => "\\" + char) + "%";
  const filter = and(
    eq(coloringPages.isPublished, true),
    ...(categorySlug ? [inArray(categories.slug, categorySlugs(categorySlug))] : []),
    ...(term ? [or(
      ilike(coloringPages.title, searchPattern),
      ilike(coloringPages.description, searchPattern),
      ilike(categories.name, searchPattern),
    )!] : []),
    ...(onlineOnly ? [sql`(
      nullif(${coloringPages.imageUrl}, '') is not null or
      nullif(${coloringPages.svgUrl}, '') is not null or
      nullif(${coloringPages.svgContent}, '') is not null
    )`] : []),
  );
  const [{ total }] = await db.select({ total: count() }).from(coloringPages)
    .leftJoin(categories, eq(coloringPages.categoryId, categories.id)).where(filter);
  const pageCount = Math.max(1, Math.ceil(total / size));
  const currentPage = Math.min(requestedPage, pageCount);
  const rows = await db.select(fields).from(coloringPages)
    .leftJoin(categories, eq(coloringPages.categoryId, categories.id))
    .where(filter)
    .orderBy(
      ...(sort === "featured" ? [desc(coloringPages.featured)] : []),
      desc(coloringPages.publishedAt), desc(coloringPages.id),
    ).limit(size).offset((currentPage - 1) * size);
  const catalog = new Map((await getAllPublishedCategories()).map(c => [c.slug, c]));
  const pages = rows.map(row => {
    const canonical = row.categorySlug ? catalog.get(canonicalCategorySlug(row.categorySlug)) : undefined;
    return canonical ? { ...row, categorySlug: canonical.slug, categoryName: canonical.name } : row;
  });
  return { pages, total, page: currentPage, pageCount };
}
