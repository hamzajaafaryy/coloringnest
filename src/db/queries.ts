import { and, count, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { cache } from "react";
import { canonicalCategorySlug, categorySlugs, consolidateCategories } from "@/lib/category-catalog";

import { db } from "./index";

import {
  categories,
  categoryFaqs,
  coloringPages,
  faqs,
  blogPosts,
} from "./schema";

/* =========================================================
   COLORING PAGE
   ========================================================= */

/**
 * Get one published coloring page by slug
 */
export async function getColoringPageBySlug(slug: string) {
  const result = await db
    .select({
      id: coloringPages.id,
      title: coloringPages.title,
      slug: coloringPages.slug,
      description: coloringPages.description,
      seoDescription: coloringPages.seoDescription,
      categoryId: coloringPages.categoryId,
      imageUrl: coloringPages.imageUrl,
      svgUrl: coloringPages.svgUrl,
      seoTitle: coloringPages.seoTitle,
      
      isPublished: coloringPages.isPublished,
      svgContent: coloringPages.svgContent,
      altText: coloringPages.altText,
      tags: coloringPages.tags,
      ageRange: coloringPages.ageRange,
      difficulty: coloringPages.difficulty,
      featured: coloringPages.featured,
      popular: coloringPages.popular,
      publishedAt: coloringPages.publishedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(coloringPages)
    .leftJoin(
      categories,
      eq(coloringPages.categoryId, categories.id)
    )
    .where(
      and(
        eq(coloringPages.slug, slug),
        eq(coloringPages.isPublished, true)
      )
    )
    .limit(1);

  return result[0] ? await canonicalizePage(result[0]) : null;
}

/**
 * Get one published coloring page
 * using both category slug and page slug
 */
export async function getColoringPageByCategoryAndSlug(
  categorySlug: string,
  slug: string
) {
  const result = await db
    .select({
      id: coloringPages.id,
      title: coloringPages.title,
      slug: coloringPages.slug,
      description: coloringPages.description,
      seoDescription: coloringPages.seoDescription,
      categoryId: coloringPages.categoryId,
      imageUrl: coloringPages.imageUrl,
      svgUrl: coloringPages.svgUrl,
      seoTitle: coloringPages.seoTitle,
      
      isPublished: coloringPages.isPublished,
      svgContent: coloringPages.svgContent,
      altText: coloringPages.altText,
      tags: coloringPages.tags,
      ageRange: coloringPages.ageRange,
      difficulty: coloringPages.difficulty,
      featured: coloringPages.featured,
      popular: coloringPages.popular,
      publishedAt: coloringPages.publishedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(coloringPages)
    .leftJoin(
      categories,
      eq(coloringPages.categoryId, categories.id)
    )
    .where(
      and(
        eq(coloringPages.slug, slug),
        inArray(categories.slug, categorySlugs(categorySlug)),
        eq(coloringPages.isPublished, true)
      )
    )
    .limit(1);

  return result[0] ? await canonicalizePage(result[0]) : null;
}

/* =========================================================
   COLORING PAGE FAQs
   ========================================================= */

/**
 * Get FAQs for a coloring page
 */
export async function getColoringPageFaqs(
  coloringPageId: number
) {
  return db
    .select({
      id: faqs.id,
      question: faqs.question,
      answer: faqs.answer,
      sortOrder: faqs.sortOrder,
    })
    .from(faqs)
    .where(eq(faqs.coloringPageId, coloringPageId))
    .orderBy(faqs.sortOrder);
}

/* =========================================================
   RELATED COLORING PAGES
   ========================================================= */

/**
 * Get related coloring pages
 *
 * Priority:
 * 1. Same category
 * 2. Other published pages
 */
export async function getRelatedColoringPages(
  currentPageId: number,
  categoryId: number | null,
  limit = 6
) {
  const categoryGroup = (await getAllPublishedCategories()).find((category) => category.sourceIds.includes(categoryId ?? -1));
  const sameCategory = categoryId
    ? await db
        .select({
          id: coloringPages.id,
          title: coloringPages.title,
          slug: coloringPages.slug,
          description: coloringPages.description,
      seoDescription: coloringPages.seoDescription,
          imageUrl: coloringPages.imageUrl,
          svgUrl: coloringPages.svgUrl,
          svgContent: coloringPages.svgContent,
          altText: coloringPages.altText,
          categoryId: coloringPages.categoryId,
          categoryName: categories.name,
          categorySlug: categories.slug,
          ageRange: coloringPages.ageRange,
          difficulty: coloringPages.difficulty,
          featured: coloringPages.featured,
          popular: coloringPages.popular,
          publishedAt: coloringPages.publishedAt,
        })
        .from(coloringPages)
        .leftJoin(
          categories,
          eq(coloringPages.categoryId, categories.id)
        )
        .where(
          and(
            inArray(coloringPages.categoryId, categoryGroup?.sourceIds || [categoryId]),
            eq(coloringPages.isPublished, true),
            ne(coloringPages.id, currentPageId)
          )
        )
        .orderBy(
          desc(coloringPages.featured),
          desc(coloringPages.publishedAt)
        )
        .limit(limit)
    : [];

  if (sameCategory.length >= limit) {
    return canonicalizePages(sameCategory);
  }

  const existingIds = new Set(
    sameCategory.map((page) => page.id)
  );

  const remaining = await db
    .select({
      id: coloringPages.id,
      title: coloringPages.title,
      slug: coloringPages.slug,
      description: coloringPages.description,
      seoDescription: coloringPages.seoDescription,
      imageUrl: coloringPages.imageUrl,
      svgUrl: coloringPages.svgUrl,
      svgContent: coloringPages.svgContent,
      altText: coloringPages.altText,
      categoryId: coloringPages.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      ageRange: coloringPages.ageRange,
      difficulty: coloringPages.difficulty,
      featured: coloringPages.featured,
      popular: coloringPages.popular,
      publishedAt: coloringPages.publishedAt,
    })
    .from(coloringPages)
    .leftJoin(
      categories,
      eq(coloringPages.categoryId, categories.id)
    )
    .where(
      and(
        eq(coloringPages.isPublished, true),
        ne(coloringPages.id, currentPageId)
      )
    )
    .orderBy(
      desc(coloringPages.popular),
      desc(coloringPages.featured),
      desc(coloringPages.publishedAt)
    )
    .limit(limit * 2);

  const filteredRemaining = remaining.filter(
    (page) => !existingIds.has(page.id)
  );

  return canonicalizePages([...sameCategory, ...filteredRemaining].slice(0, limit));
}

/* =========================================================
   SITEMAP: small projections avoid loading large SVG payloads
   ========================================================= */

export async function getSitemapColoringPages() {
  return db
    .select({
      slug: coloringPages.slug,
      categoryId: coloringPages.categoryId,
      imageUrl: coloringPages.imageUrl,
      publishedAt: coloringPages.publishedAt,
      hasOnlineVersion: sql<boolean>`(
        coalesce(${coloringPages.svgContent}, '') <> ''
        OR coalesce(${coloringPages.svgUrl}, '') <> ''
      )`,
    })
    .from(coloringPages)
    .where(eq(coloringPages.isPublished, true));
}

export async function getSitemapBlogPosts() {
  return db
    .select({
      slug: blogPosts.slug,
      publishedAt: blogPosts.publishedAt,
      featuredImage: blogPosts.featuredImage,
    })
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true));
}

/* =========================================================
   ALL COLORING PAGES
   ========================================================= */

/**
 * Get all published coloring pages
 */
export async function getAllPublishedColoringPages() {
  const rows = await db
    .select({
      id: coloringPages.id,
      title: coloringPages.title,
      slug: coloringPages.slug,
      categoryId: coloringPages.categoryId,
      publishedAt: coloringPages.publishedAt,
    })
    .from(coloringPages)
    .where(eq(coloringPages.isPublished, true))
    .orderBy(desc(coloringPages.publishedAt));

  return rows;
}

/**
 * Get all published coloring pages
 * with category information
 */
export async function getAllPublishedColoringPagesWithCategory() {
  const rows = await db
    .select({
      id: coloringPages.id,
      title: coloringPages.title,
      slug: coloringPages.slug,
      description: coloringPages.description,
      seoDescription: coloringPages.seoDescription,
      imageUrl: coloringPages.imageUrl,
      svgUrl: coloringPages.svgUrl,
      svgContent: coloringPages.svgContent,
      altText: coloringPages.altText,
      categoryId: coloringPages.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      ageRange: coloringPages.ageRange,
      difficulty: coloringPages.difficulty,
      featured: coloringPages.featured,
      popular: coloringPages.popular,
      publishedAt: coloringPages.publishedAt,
    })
    .from(coloringPages)
    .leftJoin(
      categories,
      eq(coloringPages.categoryId, categories.id)
    )
    .where(eq(coloringPages.isPublished, true))
    .orderBy(
      desc(coloringPages.featured),
      desc(coloringPages.publishedAt)
    );

  return canonicalizePages(rows);
}

/* =========================================================
   CATEGORIES
   ========================================================= */

/**
 * Get all categories
 *
 * Category metadata now comes entirely from Supabase.
 */
export const getAllPublishedCategories = cache(async () => {
  const rows = await db.select({
    id: categories.id,
    name: categories.name,
    slug: categories.slug,
    description: categories.description,
    imageUrl: categories.imageUrl,
    seoTitle: categories.seoTitle,
    seoDescription: categories.seoDescription,
    iconName: categories.iconName,
    featured: categories.featured,
    popular: categories.popular,
    heroColor: categories.heroColor,
    subcategories: categories.subcategories,
    pageCount: count(coloringPages.id),
  }).from(categories).leftJoin(coloringPages, and(
    eq(coloringPages.categoryId, categories.id),
    eq(coloringPages.isPublished, true),
  )).groupBy(categories.id);
  return consolidateCategories(rows);
});

export async function getCategoryBySlugFromDb(slug: string) {
  return (await getAllPublishedCategories()).find((category) =>
    category.slug === canonicalCategorySlug(slug)) || null;
}

type CategorizedPage = { categorySlug: string | null; categoryName: string | null };

async function canonicalizePages<T extends CategorizedPage>(pages: T[]): Promise<T[]> {
  const catalog = new Map((await getAllPublishedCategories()).map((category) => [category.slug, category]));
  return pages.map((page) => {
    const category = page.categorySlug ? catalog.get(canonicalCategorySlug(page.categorySlug)) : undefined;
    return category ? { ...page, categorySlug: category.slug, categoryName: category.name } : page;
  });
}

async function canonicalizePage<T extends CategorizedPage>(page: T): Promise<T> {
  return (await canonicalizePages([page]))[0];
}

/**
 * Get category FAQs
 */
export async function getCategoryFaqs(
  categoryId: number, sourceIds = [categoryId]
) {
  return db
    .select({
      id: categoryFaqs.id,
      question: categoryFaqs.question,
      answer: categoryFaqs.answer,
      sortOrder: categoryFaqs.sortOrder,
    })
    .from(categoryFaqs)
    .where(inArray(categoryFaqs.categoryId, sourceIds))
    .orderBy(categoryFaqs.sortOrder);
}

/* =========================================================
   COLORING PAGES BY CATEGORY
   ========================================================= */

/**
 * Get all published coloring pages
 * for a specific category slug
 */
export async function getPublishedColoringPagesByCategorySlug(
  categorySlug: string
) {
  const rows = await db
    .select({
      id: coloringPages.id,
      title: coloringPages.title,
      slug: coloringPages.slug,
      description: coloringPages.description,
      seoDescription: coloringPages.seoDescription,
      imageUrl: coloringPages.imageUrl,
      svgUrl: coloringPages.svgUrl,
      svgContent: coloringPages.svgContent,
      altText: coloringPages.altText,
      categoryId: coloringPages.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      ageRange: coloringPages.ageRange,
      difficulty: coloringPages.difficulty,
      featured: coloringPages.featured,
      popular: coloringPages.popular,
      publishedAt: coloringPages.publishedAt,
    })
    .from(coloringPages)
    .leftJoin(
      categories,
      eq(coloringPages.categoryId, categories.id)
    )
    .where(
      and(
        inArray(categories.slug, categorySlugs(categorySlug)),
        eq(coloringPages.isPublished, true)
      )
    )
    .orderBy(
      desc(coloringPages.featured),
      desc(coloringPages.publishedAt)
    );

  return canonicalizePages(rows);
}

/* =========================================================
   BLOG POSTS
   ========================================================= */

/**
 * Get all published blog posts
 */
export async function getAllPublishedBlogPosts() {
  return db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      author: blogPosts.author,
      category: blogPosts.category,
      readTime: blogPosts.readTime,
      featuredImage: blogPosts.featuredImage,
      seoTitle: blogPosts.seoTitle,
      seoDescription: blogPosts.seoDescription,
      tags: blogPosts.tags,
      isPublished: blogPosts.isPublished,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.publishedAt));
}

/**
 * Get one published blog post by slug
 */
export async function getBlogPostBySlugFromDb(
  slug: string
) {
  const result = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      author: blogPosts.author,
      category: blogPosts.category,
      readTime: blogPosts.readTime,
      featuredImage: blogPosts.featuredImage,
      seoTitle: blogPosts.seoTitle,
      seoDescription: blogPosts.seoDescription,
      tags: blogPosts.tags,
      isPublished: blogPosts.isPublished,
      publishedAt: blogPosts.publishedAt,
    })
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.isPublished, true)
      )
    )
    .limit(1);

  return result[0] ?? null;
}