"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { blogPosts, categories, coloringPages } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login/");
}

function text(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function list(formData: FormData, name: string) {
  const value = text(formData, name);
  return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : null;
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 180);
}

export async function createColoringPage(formData: FormData) {
  await requireAdmin();
  const title = text(formData, "title"); if (!title) return;
  const published = checkbox(formData, "isPublished");
  await db.insert(coloringPages).values({ title, slug: text(formData, "slug") || slugify(title), description: text(formData, "description"), categoryId: Number(formData.get("categoryId")) || null, imageUrl: text(formData, "imageUrl"), svgUrl: text(formData, "svgUrl"), svgContent: text(formData, "svgContent"), seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), isPublished: published, altText: text(formData, "altText"), tags: list(formData, "tags"), ageRange: text(formData, "ageRange"), difficulty: text(formData, "difficulty"), featured: checkbox(formData, "featured"), popular: checkbox(formData, "popular"), publishedAt: published ? new Date() : null });
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/coloring-pages/");
}

export async function updateColoringPage(id: number, formData: FormData) {
  await requireAdmin();
  const title = text(formData, "title"); if (!title) return;
  const published = checkbox(formData, "isPublished");
  const existing = await db.select({ publishedAt: coloringPages.publishedAt }).from(coloringPages).where(eq(coloringPages.id, id)).limit(1);
  const publishedAt = published ? existing[0]?.publishedAt ?? new Date() : existing[0]?.publishedAt ?? null;
  await db.update(coloringPages).set({ title, slug: text(formData, "slug") || slugify(title), description: text(formData, "description"), categoryId: Number(formData.get("categoryId")) || null, imageUrl: text(formData, "imageUrl"), svgUrl: text(formData, "svgUrl"), svgContent: text(formData, "svgContent"), seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), isPublished: published, altText: text(formData, "altText"), tags: list(formData, "tags"), ageRange: text(formData, "ageRange"), difficulty: text(formData, "difficulty"), featured: checkbox(formData, "featured"), popular: checkbox(formData, "popular"), publishedAt }).where(eq(coloringPages.id, id));
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/color-online/"); revalidatePath("/sitemap.xml"); redirect("/admin/coloring-pages/");
}

export async function deleteColoringPage(id: number) {
  await requireAdmin(); await db.delete(coloringPages).where(eq(coloringPages.id, id));
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/coloring-pages/");
}

export async function createCategory(formData: FormData) {
  await requireAdmin(); const name = text(formData, "name"); if (!name) return;
  await db.insert(categories).values({ name, slug: text(formData, "slug") || slugify(name), description: text(formData, "description"), imageUrl: text(formData, "imageUrl"), seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), iconName: text(formData, "iconName"), featured: checkbox(formData, "featured"), popular: checkbox(formData, "popular"), heroColor: text(formData, "heroColor"), subcategories: list(formData, "subcategories") });
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/categories/");
}

export async function updateCategory(id: number, formData: FormData) {
  await requireAdmin(); const name = text(formData, "name"); if (!name) return;
  await db.update(categories).set({ name, slug: text(formData, "slug") || slugify(name), description: text(formData, "description"), imageUrl: text(formData, "imageUrl"), seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), iconName: text(formData, "iconName"), featured: checkbox(formData, "featured"), popular: checkbox(formData, "popular"), heroColor: text(formData, "heroColor"), subcategories: list(formData, "subcategories") }).where(eq(categories.id, id));
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/categories/");
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  const linked = await db.select({ id: coloringPages.id }).from(coloringPages).where(eq(coloringPages.categoryId, id)).limit(1);
  if (linked.length) throw new Error("Cannot delete a category that still has coloring pages.");
  await db.delete(categories).where(eq(categories.id, id)); revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/categories/");
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin(); const title = text(formData, "title"); if (!title) return; const published = checkbox(formData, "isPublished");
  await db.insert(blogPosts).values({ title, slug: text(formData, "slug") || slugify(title), excerpt: text(formData, "excerpt"), content: text(formData, "content"), author: text(formData, "author"), category: text(formData, "category"), readTime: text(formData, "readTime"), featuredImage: text(formData, "featuredImage"), seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), tags: list(formData, "tags"), isPublished: published, publishedAt: published ? new Date() : null });
  revalidatePath("/blog/"); revalidatePath("/sitemap.xml"); redirect("/admin/blog/");
}

export async function updateBlogPost(id: number, formData: FormData) {
  await requireAdmin(); const title = text(formData, "title"); if (!title) return; const published = checkbox(formData, "isPublished");
  const existing = await db.select({ publishedAt: blogPosts.publishedAt }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1); const publishedAt = published ? existing[0]?.publishedAt ?? new Date() : existing[0]?.publishedAt ?? null;
  await db.update(blogPosts).set({ title, slug: text(formData, "slug") || slugify(title), excerpt: text(formData, "excerpt"), content: text(formData, "content"), author: text(formData, "author"), category: text(formData, "category"), readTime: text(formData, "readTime"), featuredImage: text(formData, "featuredImage"), seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), tags: list(formData, "tags"), isPublished: published, publishedAt }).where(eq(blogPosts.id, id));
  revalidatePath("/blog/"); revalidatePath("/sitemap.xml"); redirect("/admin/blog/");
}

export async function deleteBlogPost(id: number) {
  await requireAdmin(); await db.delete(blogPosts).where(eq(blogPosts.id, id)); revalidatePath("/blog/"); revalidatePath("/sitemap.xml"); redirect("/admin/blog/");
}
