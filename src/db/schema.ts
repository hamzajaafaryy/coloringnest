import {
  pgTable,
  bigint,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

/* ==========================================
   CATEGORIES
   ========================================== */

export const categories = pgTable("categories", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  name: text("name").notNull(),
  slug: text("slug"),
  description: text("description"),
  imageUrl: text("image_url"),

  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),

  iconName: text("icon_name"),

  featured: boolean("featured").default(false),
  popular: boolean("popular").default(false),

  heroColor: text("hero_color"),

  subcategories: text("subcategories").array(),
});

/* ==========================================
   CATEGORY FAQs
   ========================================== */

export const categoryFaqs = pgTable("category_faqs", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  categoryId: bigint("category_id", { mode: "number" })
    .notNull(),

  question: text("question"),
  answer: text("answer"),

  sortOrder: bigint("sort_order", { mode: "number" }),
});

/* ==========================================
   COLORING PAGES
   ========================================== */

export const coloringPages = pgTable("coloring_pages", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  title: text("title").notNull(),
  slug: text("slug"),
  description: text("description"),

  categoryId: bigint("category_id", { mode: "number" }),

  imageUrl: text("image_url"),
  svgUrl: text("svg_url"),
  svgContent: text("svg_content"),

  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),

  isPublished: boolean("is_published"),

  altText: text("alt_text"),

  tags: text("tags").array(),

  ageRange: text("age_range"),
  difficulty: text("difficulty"),

  featured: boolean("featured").default(false),
  popular: boolean("popular").default(false),

  publishedAt: timestamp("published_at", {
    withTimezone: true,
  }),
});

/* ==========================================
   TAGS
   ========================================== */

export const tags = pgTable("tags", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  name: text("name").notNull(),
  slug: text("slug"),
});

/* ==========================================
   BLOG POSTS
   ========================================== */

export const blogPosts = pgTable("blog_posts", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  title: text("title").notNull(),
  slug: text("slug"),

  excerpt: text("excerpt"),
  content: text("content"),

  author: text("author"),
  category: text("category"),
  readTime: text("read_time"),

  featuredImage: text("featured_image"),

  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),

  tags: text("tags").array(),

  isPublished: boolean("is_published"),

  publishedAt: timestamp("published_at", {
    withTimezone: true,
  }),
});

/* ==========================================
   COLORING PAGE FAQs
   ========================================== */

export const faqs = pgTable("faqs", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  coloringPageId: bigint("coloring_page_id", {
    mode: "number",
  }).notNull(),

  question: text("question"),
  answer: text("answer"),

  sortOrder: bigint("sort_order", { mode: "number" }),
});

/* ==========================================
   ALIASES
   ========================================== */

export const categoriesTable = categories;
export const coloringPagesTable = coloringPages;
export const blogPostsTable = blogPosts;