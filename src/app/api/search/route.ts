import { NextRequest, NextResponse } from "next/server";

import {
  getAllPublishedColoringPagesWithCategory,
  getAllPublishedCategories,
} from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase();

    if (!query) {
      return NextResponse.json({
        categories: [],
        pages: [],
      });
    }

    const [categories, pages] = await Promise.all([
      getAllPublishedCategories(),
      getAllPublishedColoringPagesWithCategory(),
    ]);

    const matchedCategories = categories
      .filter(
        (category) =>
          category.name.toLowerCase().includes(query) ||
          category.slug?.toLowerCase().includes(query)
      )
      .slice(0, 3);

    const matchedPages = pages
      .filter((page) => {
        const title = page.title?.toLowerCase() ?? "";
        const description = page.description?.toLowerCase() ?? "";
        const categoryName = page.categoryName?.toLowerCase() ?? "";
        const categorySlug = page.categorySlug?.toLowerCase() ?? "";

        return (
          title.includes(query) ||
          description.includes(query) ||
          categoryName.includes(query) ||
          categorySlug.includes(query)
        );
      })
      .slice(0, 5);

    return NextResponse.json({
      categories: matchedCategories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })),
      pages: matchedPages.map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        categorySlug: page.categorySlug,
      })),
    });
  } catch (error) {
    console.error("Search API error:", error);

    return NextResponse.json(
      {
        categories: [],
        pages: [],
      },
      { status: 500 }
    );
  }
}