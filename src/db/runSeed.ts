import { eq } from "drizzle-orm";

import { db, pool } from "./index";

import {
  categories,
  categoryFaqs,
  coloringPages,
  faqs,
  blogPosts,
} from "./schema";

import { CATEGORIES } from "@/lib/data/categories";
import { COLORING_PAGES } from "@/lib/data/coloringPages";
import { BLOG_POSTS } from "@/lib/data/blogPosts";

async function main() {
  console.log("🌱 Starting database seed...\n");

  /* ==========================================
     1. CATEGORIES
     ========================================== */

  for (const category of CATEGORIES) {
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, category.slug))
      .limit(1);

    let categoryId: number;

    if (existing.length > 0) {
      categoryId = existing[0].id;

      await db
        .update(categories)
        .set({
          name: category.name,
          description: category.description,
          seoTitle: category.seoTitle,
          seoDescription: category.seoDescription,
          iconName: category.iconName,
          featured: category.featured,
          popular: category.popular,
          heroColor: category.heroColor,
          subcategories: category.subcategories ?? null,
        })
        .where(eq(categories.id, categoryId));

      console.log(`↻ Category updated: ${category.name}`);
    } else {
      const inserted = await db
        .insert(categories)
        .values({
          name: category.name,
          slug: category.slug,
          description: category.description,
          seoTitle: category.seoTitle,
          seoDescription: category.seoDescription,
          iconName: category.iconName,
          featured: category.featured,
          popular: category.popular,
          heroColor: category.heroColor,
          subcategories: category.subcategories ?? null,
        })
        .returning({ id: categories.id });

      categoryId = inserted[0].id;

      console.log(`✅ Category created: ${category.name}`);
    }

    /* ==========================================
       CATEGORY FAQs
       ========================================== */

    if (category.faqs && category.faqs.length > 0) {
      const existingFaqs = await db
        .select({ id: categoryFaqs.id })
        .from(categoryFaqs)
        .where(eq(categoryFaqs.categoryId, categoryId));

      if (existingFaqs.length === 0) {
        for (let i = 0; i < category.faqs.length; i++) {
          const faq = category.faqs[i];

          await db.insert(categoryFaqs).values({
            categoryId,
            question: faq.question,
            answer: faq.answer,
            sortOrder: i,
          });
        }

        console.log(
          `   └─ ${category.faqs.length} category FAQ(s) added`
        );
      }
    }
  }

  /* ==========================================
     2. COLORING PAGES
     ========================================== */

  for (const page of COLORING_PAGES) {
    const category = await db
      .select({
        id: categories.id,
      })
      .from(categories)
      .where(eq(categories.slug, page.categorySlug))
      .limit(1);

    const categoryId = category[0]?.id ?? null;

    if (!categoryId) {
      console.log(
        `⚠️ Category not found for page: ${page.slug}`
      );
      continue;
    }

    const existing = await db
      .select({
        id: coloringPages.id,
      })
      .from(coloringPages)
      .where(eq(coloringPages.slug, page.slug))
      .limit(1);

    let pageId: number;

    if (existing.length > 0) {
      pageId = existing[0].id;

      await db
        .update(coloringPages)
        .set({
          title: page.title,
          description: page.description,
          categoryId,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          isPublished: true,
          svgContent: page.svgContent,
          altText: page.altText,
          tags: page.tags,
          ageRange: page.ageRange,
          difficulty: page.difficulty,
          featured: page.featured ?? false,
          popular: page.popular ?? false,
          publishedAt: new Date(
            `${page.publishedDate}T00:00:00.000Z`
          ),
        })
        .where(eq(coloringPages.id, pageId));

      console.log(`↻ Page updated: ${page.slug}`);
    } else {
      const inserted = await db
        .insert(coloringPages)
        .values({
          title: page.title,
          slug: page.slug,
          description: page.description,
          categoryId,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          isPublished: true,
          svgContent: page.svgContent,
          altText: page.altText,
          tags: page.tags,
          ageRange: page.ageRange,
          difficulty: page.difficulty,
          featured: page.featured ?? false,
          popular: page.popular ?? false,
          publishedAt: new Date(
            `${page.publishedDate}T00:00:00.000Z`
          ),
        })
        .returning({
          id: coloringPages.id,
        });

      pageId = inserted[0].id;

      console.log(`✅ Page created: ${page.slug}`);
    }

    /* ==========================================
       PAGE FAQs
       ========================================== */

    if (page.faqs && page.faqs.length > 0) {
      const existingFaqs = await db
        .select({
          id: faqs.id,
        })
        .from(faqs)
        .where(eq(faqs.coloringPageId, pageId));

      if (existingFaqs.length === 0) {
        for (let i = 0; i < page.faqs.length; i++) {
          const faq = page.faqs[i];

          await db.insert(faqs).values({
            coloringPageId: pageId,
            question: faq.question,
            answer: faq.answer,
            sortOrder: i,
          });
        }

        console.log(
          `   └─ ${page.faqs.length} page FAQ(s) added`
        );
      } else {
        console.log(`   └─ Page FAQs already exist`);
      }
    }
  }

  /* ==========================================
     3. BLOG POSTS
     ========================================== */

  for (const post of BLOG_POSTS) {
    const existing = await db
      .select({
        id: blogPosts.id,
      })
      .from(blogPosts)
      .where(eq(blogPosts.slug, post.slug))
      .limit(1);

    const publishedAt = new Date(
      `${post.publishedDate}T00:00:00.000Z`
    );

    if (existing.length > 0) {
      await db
        .update(blogPosts)
        .set({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          category: post.category,
          readTime: post.readTime,
          featuredImage: post.featuredImage,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          tags: post.tags,
          isPublished: true,
          publishedAt,
        })
        .where(eq(blogPosts.id, existing[0].id));

      console.log(`↻ Blog post updated: ${post.slug}`);
    } else {
      await db.insert(blogPosts).values({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        category: post.category,
        readTime: post.readTime,
        featuredImage: post.featuredImage,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        tags: post.tags,
        isPublished: true,
        publishedAt,
      });

      console.log(`✅ Blog post created: ${post.slug}`);
    }
  }

  console.log("\n🎉 SEED COMPLETED SUCCESSFULLY!");

  /* ==========================================
     4. TOTALS
     ========================================== */

  const totalCategories = await db
    .select({ id: categories.id })
    .from(categories);

  const totalPages = await db
    .select({ id: coloringPages.id })
    .from(coloringPages);

  const totalBlogPosts = await db
    .select({ id: blogPosts.id })
    .from(blogPosts);

  console.log(`📂 Total categories: ${totalCategories.length}`);
  console.log(`📦 Total coloring pages: ${totalPages.length}`);
  console.log(`📝 Total blog posts: ${totalBlogPosts.length}`);
}

/* ==========================================
   RUN SEED
   ========================================== */

main()
  .catch((error) => {
    console.error("\n❌ SEED FAILED\n");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });