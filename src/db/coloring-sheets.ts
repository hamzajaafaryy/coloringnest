import { asc, eq, inArray } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { coloringSheets } from "@/db/schema";

export const getAdditionalSheets = cache(async (pageId: number) => db.select().from(coloringSheets).where(eq(coloringSheets.coloringPageId, pageId)).orderBy(asc(coloringSheets.sortOrder)));

export async function getAllCollectionImages(pageIds: number[]) {
  if (!pageIds.length) return [];
  return db.select({ pageId: coloringSheets.coloringPageId, imageUrl: coloringSheets.imageUrl, updatedAt: coloringSheets.updatedAt }).from(coloringSheets).where(inArray(coloringSheets.coloringPageId, pageIds));
}
