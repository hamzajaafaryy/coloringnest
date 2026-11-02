import { NextRequest, NextResponse } from "next/server";
import { getAllPublishedCategories } from "@/db/queries";
import { getPublishedCardPage } from "@/db/page-cards";

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") || "").trim().slice(0, 80);
  if (!query) return NextResponse.json({ categories: [], pages: [] });
  try {
    const [categories, listing] = await Promise.all([
      getAllPublishedCategories(),
      getPublishedCardPage({ query, limit: 5 }),
    ]);
    const lowercaseQuery = query.toLowerCase();
    return NextResponse.json({
      categories: categories.filter(c => c.pageCount > 0 &&
        (c.name.toLowerCase().includes(lowercaseQuery) || c.slug?.toLowerCase().includes(lowercaseQuery)))
        .slice(0, 3).map(c => ({ id: c.id, name: c.name, slug: c.slug })),
      pages: listing.pages.map(p => ({ id: p.id, title: p.title, slug: p.slug, categorySlug: p.categorySlug })),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ categories: [], pages: [] }, { status: 500 });
  }
}
