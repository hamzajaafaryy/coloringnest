import "server-only";
import { and, count, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "@/db";
import { categories, coloringPages, coloringSheets } from "@/db/schema";
import type { PinArtwork } from "./pinterest-studio";

const fields = {
  id: coloringPages.id,
  title: coloringPages.title,
  slug: coloringPages.slug,
  imageUrl: coloringPages.imageUrl,
  description: coloringPages.description,
  seoDescription: coloringPages.seoDescription,
  altText: coloringPages.altText,
  categoryName: categories.name,
  categorySlug: categories.slug,
};

export async function listPinterestArtwork(query = "", page = 1) {
  const text = query.trim().slice(0, 75);
  const pattern = "%" + text.replace(/[%_\\]/g, char => "\\" + char) + "%";
  const filter = and(
    eq(coloringPages.isPublished, true),
    ...(text ? [or(ilike(coloringPages.title, pattern), ilike(categories.name, pattern))!] : []),
  );
  const size = 18;
  const [{ total }] = await db.select({ total: count() }).from(coloringPages)
    .leftJoin(categories, eq(coloringPages.categoryId, categories.id)).where(filter);
  const pageCount = Math.max(1, Math.ceil(total / size));
  const safePage = Math.min(pageCount, Math.max(1, Math.trunc(page) || 1));
  const rows = await db.select(fields).from(coloringPages)
    .leftJoin(categories, eq(coloringPages.categoryId, categories.id))
    .where(filter)
    .orderBy(desc(coloringPages.publishedAt), desc(coloringPages.id))
    .limit(size).offset((safePage - 1) * size);
  const ids = rows.map(r => r.id);
  const sheets = ids.length
    ? await db.select({id:coloringSheets.id, title:coloringSheets.title,
      altText:coloringSheets.altText, imageUrl:coloringSheets.imageUrl,
      coloringPageId: coloringSheets.coloringPageId})
      .from(coloringSheets).where(
        // imported below to avoid bringing SVG heavy content into the admin grid
        inArray(coloringSheets.coloringPageId, ids)
      ).orderBy(coloringSheets.sortOrder)
    : [];
  const items: PinArtwork[] = rows.map(row => ({
    ...row,
    slug: row.slug || String(row.id),
    sheets: sheets.filter(s => s.coloringPageId === row.id).map(s => ({
      id:s.id, title:s.title, altText:s.altText, imageUrl:s.imageUrl,
    })),
  }));
  return { items, page: safePage, pageCount, total };
}

export async function getPinterestArtwork(id: number): Promise<PinArtwork | null> {
  const [row] = await db.select(fields).from(coloringPages)
    .leftJoin(categories, eq(coloringPages.categoryId, categories.id))
    .where(and(eq(coloringPages.id, id), eq(coloringPages.isPublished, true))).limit(1);
  if (!row) return null;
  const sheets = await db.select({
    id: coloringSheets.id, title: coloringSheets.title,
    altText: coloringSheets.altText, imageUrl: coloringSheets.imageUrl,
  }).from(coloringSheets).where(eq(coloringSheets.coloringPageId, id)).orderBy(coloringSheets.sortOrder);
  return { ...row, slug: row.slug || String(row.id), sheets };
}
