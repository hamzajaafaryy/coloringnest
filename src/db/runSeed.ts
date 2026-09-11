import "dotenv/config";
import { db } from "./index";
import { categoriesTable, coloringPagesTable, blogPostsTable } from "./schema";
import { CATEGORIES } from "../lib/data/categories";
import { COLORING_PAGES } from "../lib/data/coloringPages";
import { BLOG_POSTS } from "../lib/data/blogPosts";

async function main() {
  console.log("Seeding PostgreSQL database...");
  try {
    for (const cat of CATEGORIES) {
      await db
        .insert(categoriesTable)
        .values({
          slug: cat.slug,
          name: cat.name,
          description: cat.description,
          seoTitle: cat.seoTitle,
          seoDescription: cat.seoDescription,
          icon: cat.iconName,
          featured: cat.featured,
          popular: cat.popular,
        })
        .onConflictDoNothing();
    }

    for (const page of COLORING_PAGES) {
      await db
        .insert(coloringPagesTable)
        .values({
          slug: page.slug,
          title: page.title,
          categorySlug: page.categorySlug,
          description: page.description,
          instructions: page.instructions,
          svgContent: page.svgContent,
          altText: page.altText,
          seoTitle: page.seoTitle,
          seoDescription: page.seoDescription,
          tags: page.tags,
          ageRange: page.ageRange,
          difficulty: page.difficulty,
          featured: page.featured,
          popular: page.popular,
        })
        .onConflictDoNothing();
    }

    for (const post of BLOG_POSTS) {
      await db
        .insert(blogPostsTable)
        .values({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          category: post.category,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          readTime: post.readTime,
        })
        .onConflictDoNothing();
    }

    console.log("Database seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

main();
