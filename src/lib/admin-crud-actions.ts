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

function sectionLines(formData: FormData, name: string) {
  if (!formData.has(name)) return undefined;
  const value = text(formData, name);
  const items = value ? value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) : [];
  return items.length ? items : null;
}

function coloringPageSectionFields(formData: FormData) {
  const fields: {
    meetYourColoringPage?: string | null;
    whatYoullNeed?: string[] | null;
    funColoringIdeas?: string[] | null;
    learningActivity?: { title: string; description: string; activity: string } | null;
    makeItYourOwn?: { description: string; challenge: string } | null;
    printingTips?: string[] | null;
  } = {};
  if (formData.has("meetYourColoringPage")) fields.meetYourColoringPage = text(formData, "meetYourColoringPage");
  if (formData.has("whatYoullNeed")) fields.whatYoullNeed = sectionLines(formData, "whatYoullNeed") ?? null;
  if (formData.has("funColoringIdeas")) fields.funColoringIdeas = sectionLines(formData, "funColoringIdeas") ?? null;
  if (formData.has("printingTips")) fields.printingTips = sectionLines(formData, "printingTips") ?? null;

  const activityKeys = ["learningActivityTitle", "learningActivityDescription", "learningActivityActivity"];
  if (activityKeys.some((key) => formData.has(key))) {
    const [title, description, activity] = activityKeys.map((key) => text(formData, key));
    if ([title, description, activity].every((value) => !value)) fields.learningActivity = null;
    else if (!title || !description || !activity) throw new Error("Complete all Learning Activity fields or clear them all.");
    else fields.learningActivity = { title, description, activity };
  }

  const makeItYourOwnKeys = ["makeItYourOwnDescription", "makeItYourOwnChallenge"];
  if (makeItYourOwnKeys.some((key) => formData.has(key))) {
    const [description, challenge] = makeItYourOwnKeys.map((key) => text(formData, key));
    if (!description && !challenge) fields.makeItYourOwn = null;
    else if (!description || !challenge) throw new Error("Complete both Make It Your Own fields or clear them both.");
    else fields.makeItYourOwn = { description, challenge };
  }

  return fields;
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

function selectedCategoryId(formData: FormData) {
  const raw = text(formData, "categoryId");
  if (!raw) return null;
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Choose a valid category.");
  }
  return id;
}

async function assertCategoryExists(categoryId: number | null) {
  if (categoryId === null) return;
  const found = await db.select({ id: categories.id }).from(categories).where(eq(categories.id, categoryId)).limit(1);
  if (!found.length) throw new Error("The selected category no longer exists. Refresh the form and choose another category.");
}

function validatePublishablePage(categoryId: number | null, formData: FormData, published: boolean) {
  if (!published) return;
  if (categoryId === null) throw new Error("Choose a category before publishing.");
  if (!text(formData, "description")) throw new Error("Add a useful description before publishing.");
  if (!text(formData, "altText")) throw new Error("Add descriptive alt text before publishing.");
  if (!text(formData, "seoDescription")) throw new Error("Add an SEO description before publishing.");
  if (!text(formData, "imageUrl") && !text(formData, "svgUrl") && !text(formData, "svgContent")) {
    throw new Error("Upload an image or SVG before publishing.");
  }
}

function validatePublishableBlogPost(formData: FormData, published: boolean) {
  if (!published) return;
  const excerpt = text(formData, "excerpt");
  const content = text(formData, "content");
  const seoDescription = text(formData, "seoDescription");
  if (!excerpt || excerpt.length < 40) throw new Error("Add a useful article excerpt (at least 40 characters) before publishing.");
  if (!content || content.length < 500) throw new Error("Add the full article content (at least 500 characters) before publishing.");
  if (!seoDescription || seoDescription.length < 80) throw new Error("Add an SEO description (at least 80 characters) before publishing.");
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
  const categoryId = selectedCategoryId(formData);
  const slug = normalizedSlug(formData, title);
  validatePublishablePage(categoryId, formData, published);
  await assertCategoryExists(categoryId);
  await assertUniqueColoringSlug(slug);
  await db.transaction(async tx => {
  const [created] = await tx.insert(coloringPages).values({ title, slug, description: text(formData, "description"), ...coloringPageSectionFields(formData), categoryId, imageUrl: text(formData, "imageUrl"), svgUrl: text(formData, "svgUrl"), svgContent: text(formData, "svgContent") ? sanitizeSvg(text(formData, "svgContent")!) : null, seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), isPublished: published, altText: text(formData, "altText"), tags: list(formData, "tags"), ageRange: text(formData, "ageRange"), difficulty: text(formData, "difficulty"), featured: checkbox(formData, "featured"), popular: checkbox(formData, "popular"), publishedAt: published ? new Date() : null }).returning({ id: coloringPages.id });
    if (sheets.length) await tx.insert(coloringSheets).values(sheets.map((sheet, sortOrder) => ({ ...sheet, imageUrl: sheet.imageUrl!, coloringPageId: created.id, sortOrder })));
  });
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/coloring-pages/");
}

export async function updateColoringPage(id: number, formData: FormData) {
  await requireAdmin();
  const title = text(formData, "title"); if (!title) return;
  const sheets = collectionInput(formData);
  const published = checkbox(formData, "isPublished");
  const categoryId = selectedCategoryId(formData);
  const slug = normalizedSlug(formData, title);
  validatePublishablePage(categoryId, formData, published);
  await assertCategoryExists(categoryId);
  await assertUniqueColoringSlug(slug, id);
  const existing = await db.select({ publishedAt: coloringPages.publishedAt }).from(coloringPages).where(eq(coloringPages.id, id)).limit(1);
  if (!existing.length) throw new Error("Coloring page not found.");
  const publishedAt = published ? existing[0].publishedAt ?? new Date() : existing[0].publishedAt ?? null;
  const nextImageUrl = text(formData, "imageUrl");
  const nextSvgUrl = text(formData, "svgUrl");
  await db.transaction(async tx => {
  await tx.update(coloringPages).set({ updatedAt: new Date(), title, slug, description: text(formData, "description"), ...coloringPageSectionFields(formData), categoryId, imageUrl: nextImageUrl, svgUrl: nextSvgUrl, svgContent: text(formData, "svgContent") ? sanitizeSvg(text(formData, "svgContent")!) : null, seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), isPublished: published, altText: text(formData, "altText"), tags: list(formData, "tags"), ageRange: text(formData, "ageRange"), difficulty: text(formData, "difficulty"), featured: checkbox(formData, "featured"), popular: checkbox(formData, "popular"), publishedAt }).where(eq(coloringPages.id, id));
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
  const nextImageUrl = text(formData, "imageUrl");
  await db.update(categories).set({ name, slug, description: text(formData, "description"), imageUrl: nextImageUrl, seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), iconName: text(formData, "iconName"), featured: checkbox(formData, "featured"), popular: checkbox(formData, "popular"), heroColor: text(formData, "heroColor"), subcategories: list(formData, "subcategories") }).where(eq(categories.id, id));
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/categories/");
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  const linked = await db.select({ id: coloringPages.id }).from(coloringPages).where(eq(coloringPages.categoryId, id)).limit(1);
  if (linked.length) throw new Error("Cannot delete a category that still has coloring pages.");
  await db.transaction(async (tx) => {
    await tx.delete(categoryFaqs).where(eq(categoryFaqs.categoryId, id));
    await tx.delete(categories).where(eq(categories.id, id));
  });
  // Storage files are retained because the same image may be referenced elsewhere.
  revalidatePath("/"); revalidatePath("/coloring-pages/"); revalidatePath("/sitemap.xml"); redirect("/admin/categories/");
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin(); const title = text(formData, "title"); if (!title) return; const published = checkbox(formData, "isPublished");
  const slug = normalizedSlug(formData, title);
  validatePublishableBlogPost(formData, published);
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
  validatePublishableBlogPost(formData, published);
  await assertUniqueBlogSlug(slug, id);
  const existing = await db.select({ publishedAt: blogPosts.publishedAt }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!existing.length) throw new Error("Blog post not found.");
  const publishedAt = published ? existing[0].publishedAt ?? new Date() : existing[0].publishedAt ?? null;
  const nextFeaturedImage = text(formData, "featuredImage");
  await db.update(blogPosts).set({ title, slug, excerpt: text(formData, "excerpt"), content: text(formData, "content"), author: text(formData, "author"), category: text(formData, "category"), readTime: text(formData, "readTime"), featuredImage: nextFeaturedImage, seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription"), tags: list(formData, "tags"), isPublished: published, publishedAt }).where(eq(blogPosts.id, id));
  // Keep old artwork in storage; it may be shared by another page or post.
  revalidatePath("/blog/");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
  redirect("/admin/blog/");
}

export async function deleteBlogPost(id: number) {
  await requireAdmin();
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  // Storage files are retained because they may be shared by other content.
  revalidatePath("/blog/"); revalidatePath("/sitemap.xml"); redirect("/admin/blog/");
}
