"use server";

import { parseSheetInputs } from "@/lib/coloring-sheets";
import { coloringSheets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { getCategoryBySlugFromDb } from "@/db/queries";
import { blogPosts, categories, categoryFaqs, coloringPages, faqs } from "@/db/schema";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteCraftColoringStorageUrl } from "@/lib/storage";
import { sanitizeSvg } from "@/lib/sanitize-svg";

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

function normalizedSlug(formData: FormData, fallback: string) {
  const slug = slugify(text(formData, "slug") || fallback);
  if (!slug) throw new Error("A valid URL slug is required.");
  return slug;
}

async function assertUniqueColoringSlug(slug: string, exceptId?: number) {
  const existing = await db.select({ id: coloringPages.id }).from(coloringPages).where(eq(coloringPages.slug, slug)).limit(1);
  if (existing.length && existing[0].id !== exceptId) throw new Error("Another coloring page already uses this slug.");
}

async function assertUniqueCategorySlug(slug: string, exceptId?: number) {
  const existing = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
  if (existing.length && existing[0].id !== exceptId) throw new Error("Another category already uses this slug.");
}

async function assertUniqueBlogSlug(slug: string, exceptId?: number) {
  const existing = await db.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  if (existing.length && existing[0].id !== exceptId) throw new Error("Another blog post already uses this slug.");
}

function validatePublishablePage(formData: FormData, published: boolean) {
  if (!published) return;
  if (!Number(formData.get("categoryId"))) throw new Error("Choose a category before publishing.");
  if (!text(formData, "imageUrl") && !text(formData, "svgUrl") && !text(formData, "svgContent")) {
    throw new Error("Upload an image or SVG before publishing.");
  }
}

function collectionInput(formData: FormData) {
  const raw = String(formData.get("collectionSheets") || "[]");
  if (raw.length > 60000) throw new Error("Collection data is too large.");
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed) && !parsed.length) return [];
  return parseSheetInputs(parsed, process.env.SUPABASE_URL || "");
}

export async function createColoringPage(formData: FormData) {
  await requireAdmin();
  const title = text(formData, "title"); if (!title) return;
  const sheets = collectionInput(formData);
  const published = checkbox(formData, "isPublished");
  const slug = normalizedSlug(formData, title);
  validatePublishablePage(formData, published);
  await assertUniqueColoringSlug(slug);
  await db.transaction(async tx => {
  const [created] = await tx.insert(coloringPages).values({ title, slug, description: text(formData, "description"), categoryId: Number(formData.get("categoryId")) || null, imageUrl: text(formData, "imageUrl"), svgUrl: text(formData, "svgUrl"), svgContent: text(formData, "svgContent") ? sanitizeSvg(text(formData, "svgContent")!) : null, seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), isPublished: published, altText: text(formData, "altText"), tags: list(formData, "tags"), ageRange: text(formData, "ageRange"), difficulty: text(formData, "difficulty"), featured: checkbox(formData, "featured"), popular: checkbox(formData, "popular"), publishedAt: published ? new Date() : null }).returning({ id: coloringPages.id });
    if (sheets.length) await tx.insert(coloringSheets).values(sheets.map((sheet, sortOrder) => ({ ...sheet, imageUrl: sheet.imageUrl!, coloringPageId: created.id, sortOrder })));
  });
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/coloring-pages/");
}

export async function updateColoringPage(id: number, formData: FormData) {
  await requireAdmin();
  const title = text(formData, "title"); if (!title) return;
  const sheets = collectionInput(formData);
  const published = checkbox(formData, "isPublished");
  const slug = normalizedSlug(formData, title);
  validatePublishablePage(formData, published);
  await assertUniqueColoringSlug(slug, id);
  const existing = await db.select({ publishedAt: coloringPages.publishedAt, imageUrl: coloringPages.imageUrl, svgUrl: coloringPages.svgUrl }).from(coloringPages).where(eq(coloringPages.id, id)).limit(1);
  const publishedAt = published ? existing[0]?.publishedAt ?? new Date() : existing[0]?.publishedAt ?? null;
  const nextImageUrl = text(formData, "imageUrl");
  const nextSvgUrl = text(formData, "svgUrl");
  await db.transaction(async tx => {
  await tx.update(coloringPages).set({ updatedAt: new Date(), title, slug, description: text(formData, "description"), categoryId: Number(formData.get("categoryId")) || null, imageUrl: nextImageUrl, svgUrl: nextSvgUrl, svgContent: text(formData, "svgContent") ? sanitizeSvg(text(formData, "svgContent")!) : null, seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), isPublished: published, altText: text(formData, "altText"), tags: list(formData, "tags"), ageRange: text(formData, "ageRange"), difficulty: text(formData, "difficulty"), featured: checkbox(formData, "featured"), popular: checkbox(formData, "popular"), publishedAt }).where(eq(coloringPages.id, id));
    await tx.delete(coloringSheets).where(eq(coloringSheets.coloringPageId, id));
    if (sheets.length) await tx.insert(coloringSheets).values(sheets.map((sheet, sortOrder) => ({ ...sheet, imageUrl: sheet.imageUrl!, coloringPageId: id, sortOrder })));
  });
  // Keep replaced artwork: another collection may still reference it.

  revalidatePath("/");
  revalidatePath("/coloring-pages/");
  revalidatePath("/coloring-pages/[category]/[slug]", "page");
  revalidatePath("/color-online/");
  revalidatePath("/sitemap.xml");
  redirect("/admin/coloring-pages/");
}

export async function deleteColoringPage(id: number) {
  await requireAdmin();
  await db.transaction(async (tx) => {
    await tx.delete(faqs).where(eq(faqs.coloringPageId, id));
    await tx.delete(coloringPages).where(eq(coloringPages.id, id));
  });
  // Shared artwork is retained; remove storage objects only after a reference audit.
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/coloring-pages/");
}

export async function createCategory(formData: FormData) {
  await requireAdmin(); const name = text(formData, "name"); if (!name) return;
  const slug = normalizedSlug(formData, name);
  if (await getCategoryBySlugFromDb(slug)) throw new Error("This category already exists. Edit the existing category instead.");
  await assertUniqueCategorySlug(slug);
  await db.insert(categories).values({ name, slug, description: text(formData, "description"), imageUrl: text(formData, "imageUrl"), seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), iconName: text(formData, "iconName"), featured: checkbox(formData, "featured"), popular: checkbox(formData, "popular"), heroColor: text(formData, "heroColor"), subcategories: list(formData, "subcategories") });
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/categories/");
}

export async function updateCategory(id: number, formData: FormData) {
  await requireAdmin(); const name = text(formData, "name"); if (!name) return;
  const slug = normalizedSlug(formData, name);
  await assertUniqueCategorySlug(slug, id);
  const existing = await db.select({ imageUrl: categories.imageUrl }).from(categories).where(eq(categories.id, id)).limit(1);
  const nextImageUrl = text(formData, "imageUrl");
  await db.update(categories).set({ name, slug, description: text(formData, "description"), imageUrl: nextImageUrl, seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), iconName: text(formData, "iconName"), featured: checkbox(formData, "featured"), popular: checkbox(formData, "popular"), heroColor: text(formData, "heroColor"), subcategories: list(formData, "subcategories") }).where(eq(categories.id, id));
  if (existing[0]?.imageUrl && existing[0].imageUrl !== nextImageUrl) await deleteCraftColoringStorageUrl(existing[0].imageUrl);
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/categories/");
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  const existing = await db.select({ imageUrl: categories.imageUrl }).from(categories).where(eq(categories.id, id)).limit(1);
  const linked = await db.select({ id: coloringPages.id }).from(coloringPages).where(eq(coloringPages.categoryId, id)).limit(1);
  if (linked.length) throw new Error("Cannot delete a category that still has coloring pages.");
  await db.transaction(async (tx) => {
    await tx.delete(categoryFaqs).where(eq(categoryFaqs.categoryId, id));
    await tx.delete(categories).where(eq(categories.id, id));
  });
  if (existing[0]?.imageUrl) await deleteCraftColoringStorageUrl(existing[0].imageUrl);
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/categories/");
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin(); const title = text(formData, "title"); if (!title) return; const published = checkbox(formData, "isPublished");
  const slug = normalizedSlug(formData, title);
  await assertUniqueBlogSlug(slug);
  await db.insert(blogPosts).values({ title, slug, excerpt: text(formData, "excerpt"), content: text(formData, "content"), author: text(formData, "author"), category: text(formData, "category"), readTime: text(formData, "readTime"), featuredImage: text(formData, "featuredImage"), seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), tags: list(formData, "tags"), isPublished: published, publishedAt: published ? new Date() : null });
  revalidatePath("/blog/");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
  redirect("/admin/blog/");
}

export async function updateBlogPost(id: number, formData: FormData) {
  await requireAdmin(); const title = text(formData, "title"); if (!title) return; const published = checkbox(formData, "isPublished");
  const slug = normalizedSlug(formData, title);
  await assertUniqueBlogSlug(slug, id);
  const existing = await db.select({ publishedAt: blogPosts.publishedAt, featuredImage: blogPosts.featuredImage }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1); const publishedAt = published ? existing[0]?.publishedAt ?? new Date() : existing[0]?.publishedAt ?? null;
  const nextFeaturedImage = text(formData, "featuredImage");
  await db.update(blogPosts).set({ title, slug, excerpt: text(formData, "excerpt"), content: text(formData, "content"), author: text(formData, "author"), category: text(formData, "category"), readTime: text(formData, "readTime"), featuredImage: nextFeaturedImage, seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), tags: list(formData, "tags"), isPublished: published, publishedAt }).where(eq(blogPosts.id, id));
  if (existing[0]?.featuredImage && existing[0].featuredImage !== nextFeaturedImage) await deleteCraftColoringStorageUrl(existing[0].featuredImage);
  revalidatePath("/blog/");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
  redirect("/admin/blog/");
}

export async function deleteBlogPost(id: number) {
  await requireAdmin();
  const existing = await db.select({ featuredImage: blogPosts.featuredImage }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  if (existing[0]?.featuredImage) await deleteCraftColoringStorageUrl(existing[0].featuredImage); revalidatePath("/blog/"); revalidatePath("/sitemap.xml"); redirect("/admin/blog/");
}
