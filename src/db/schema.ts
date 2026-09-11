import { pgTable, serial, text, varchar, boolean, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description").notNull(),
  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: text("seo_description"),
  icon: varchar("icon", { length: 60 }).default("Palette"),
  featured: boolean("featured").default(false),
  popular: boolean("popular").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coloringPagesTable = pgTable("coloring_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  categorySlug: varchar("category_slug", { length: 120 }).notNull(),
  description: text("description").notNull(),
  instructions: text("instructions"),
  svgContent: text("svg_content").notNull(),
  altText: varchar("alt_text", { length: 255 }).notNull(),
  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: text("seo_description"),
  tags: jsonb("tags").$type<string[]>().default([]),
  ageRange: varchar("age_range", { length: 60 }).default("All Ages"),
  difficulty: varchar("difficulty", { length: 40 }).default("Medium"), // Easy, Medium, Detailed
  featured: boolean("featured").default(false),
  popular: boolean("popular").default(false),
  viewsCount: integer("views_count").default(0),
  downloadsCount: integer("downloads_count").default(0),
  printsCount: integer("prints_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 100 }).default("ColoringNest Team"),
  category: varchar("category", { length: 100 }).default("Coloring Tips"),
  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: text("seo_description"),
  readTime: varchar("read_time", { length: 30 }).default("5 min read"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pageEventsTable = pgTable("page_events", {
  id: serial("id").primaryKey(),
  pageSlug: varchar("page_slug", { length: 160 }).notNull(),
  eventType: varchar("event_type", { length: 60 }).notNull(), // 'view' | 'download_original' | 'download_colored' | 'print' | 'color_start'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
