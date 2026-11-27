import {
  pgTable,
  bigint,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
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
}, (table) => [
  uniqueIndex("categories_slug_unique").on(table.slug),
]);

/* ==========================================
   CATEGORY FAQs
   ========================================== */

export const categoryFaqs = pgTable("category_faqs", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  categoryId: bigint("category_id", { mode: "number" })
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),

  question: text("question"),
  answer: text("answer"),

  sortOrder: bigint("sort_order", { mode: "number" }),
}, (table) => [
  index("category_faqs_category_id_idx").on(table.categoryId),
]);

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

  categoryId: bigint("category_id", { mode: "number" })
    .references(() => categories.id),

  imageUrl: text("image_url"),
  svgUrl: text("svg_url"),
  svgContent: text("svg_content"),

  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),

  updatedAt: timestamp("updated_at", { withTimezone: true }),

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
}, (table) => [
  uniqueIndex("coloring_pages_slug_unique").on(table.slug),
  index("coloring_pages_category_id_idx").on(table.categoryId),
]);

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
}, (table) => [
  uniqueIndex("blog_posts_slug_unique").on(table.slug),
]);

/* ==========================================
   COLORING PAGE FAQs
   ========================================== */

export const faqs = pgTable("faqs", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  coloringPageId: bigint("coloring_page_id", {
    mode: "number",
  }).notNull().references(() => coloringPages.id, { onDelete: "cascade" }),

  question: text("question"),
  answer: text("answer"),

  sortOrder: bigint("sort_order", { mode: "number" }),
}, (table) => [
  index("faqs_coloring_page_id_idx").on(table.coloringPageId),
]);

/* ==========================================
   ALIASES
   ========================================== */

export const categoriesTable = categories;
export const coloringPagesTable = coloringPages;
export const blogPostsTable = blogPosts;

// Additional artwork in a post. The existing image remains the first sheet.
export const coloringSheets = pgTable("coloring_sheets", {
  id: text("id").primaryKey(),
  coloringPageId: bigint("coloring_page_id", { mode: "number" }).notNull().references(() => coloringPages.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  altText: text("alt_text").notNull(),
  imageUrl: text("image_url").notNull(),
  svgUrl: text("svg_url"),
  sortOrder: bigint("sort_order", { mode: "number" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("coloring_sheets_page_order_idx").on(table.coloringPageId, table.sortOrder),
]);
