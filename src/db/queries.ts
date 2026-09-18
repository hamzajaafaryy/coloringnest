import { and, desc, eq, ne } from "drizzle-orm";

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
      categoryId: coloringPages.categoryId,
      imageUrl: coloringPages.imageUrl,
      svgUrl: coloringPages.svgUrl,
      seoTitle: coloringPages.seoTitle,
      seoDescription: coloringPages.seoDescription,
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

  return result[0] ?? null;
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
      categoryId: coloringPages.categoryId,
      imageUrl: coloringPages.imageUrl,
      svgUrl: coloringPages.svgUrl,
      seoTitle: coloringPages.seoTitle,
      seoDescription: coloringPages.seoDescription,
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
        eq(categories.slug, categorySlug),
        eq(coloringPages.isPublished, true)
      )
    )
    .limit(1);

  return result[0] ?? null;
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
  const sameCategory = categoryId
    ? await db
        .select({
          id: coloringPages.id,
          title: coloringPages.title,
          slug: coloringPages.slug,
          description: coloringPages.description,
          imageUrl: coloringPages.imageUrl,
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
            eq(coloringPages.categoryId, categoryId),
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
    return sameCategory;
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
      imageUrl: coloringPages.imageUrl,
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

  return [
    ...sameCategory,
    ...filteredRemaining,
  ].slice(0, limit);
}

/* =========================================================
   ALL COLORING PAGES
   ========================================================= */

/**
 * Get all published coloring pages
 */
export async function getAllPublishedColoringPages() {
  return db
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
}

/**
 * Get all published coloring pages
 * with category information
 */
export async function getAllPublishedColoringPagesWithCategory() {
  return db
    .select({
      id: coloringPages.id,
      title: coloringPages.title,
      slug: coloringPages.slug,
      description: coloringPages.description,
      imageUrl: coloringPages.imageUrl,
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
}

/* =========================================================
   CATEGORIES
   ========================================================= */

/**
 * Get all categories
 *
 * Category metadata now comes entirely from Supabase.
 */
export async function getAllPublishedCategories() {
  return db
    .select({
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
    })
    .from(categories)
    .orderBy(categories.name);
}

/**
 * Get one category by slug
 *
 * Category metadata now comes entirely from Supabase.
 */
export async function getCategoryBySlugFromDb(
  slug: string
) {
  const result = await db
    .select({
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
    })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  return result[0] ?? null;
}

/**
 * Get category FAQs
 */
export async function getCategoryFaqs(
  categoryId: number
) {
  return db
    .select({
      id: categoryFaqs.id,
      question: categoryFaqs.question,
      answer: categoryFaqs.answer,
      sortOrder: categoryFaqs.sortOrder,
    })
    .from(categoryFaqs)
    .where(eq(categoryFaqs.categoryId, categoryId))
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
  return db
    .select({
      id: coloringPages.id,
      title: coloringPages.title,
      slug: coloringPages.slug,
      description: coloringPages.description,
      imageUrl: coloringPages.imageUrl,
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
        eq(categories.slug, categorySlug),
        eq(coloringPages.isPublished, true)
      )
    )
    .orderBy(
      desc(coloringPages.featured),
      desc(coloringPages.publishedAt)
    );
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