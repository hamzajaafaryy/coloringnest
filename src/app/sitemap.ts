import { getAllCollectionImages } from "@/db/coloring-sheets";
import type { MetadataRoute } from "next";
import { getAllPublishedCategories, getSitemapBlogPosts, getSitemapColoringPages } from "@/db/queries";
import { buildCanonicalUrl, SITE_CONFIG } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Only list canonical, public URLs. Next.js uses slashless URLs by default,
// and buildCanonicalUrl ensures the sitemap agrees with page metadata.
const publicRoutes = [
  "/",
  "/name-coloring",
  "/coloring-pages",
  "/printable-coloring-pages",
  "/color-online",
  "/play",
  "/blog",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
];

function absoluteImageUrl(imageUrl: string) {
  return new URL(imageUrl, `${SITE_CONFIG.domain}/`).href;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, categories, blogPosts] = await Promise.all([
    getSitemapColoringPages(),
    getAllPublishedCategories(),
    getSitemapBlogPosts(),
  ]);

  const routes: MetadataRoute.Sitemap = publicRoutes.map((path) => ({
    url: buildCanonicalUrl(path),
  }));

  // Consolidated categories may be backed by multiple database category IDs.
  const categorySlugById = new Map<number, string>();
  for (const category of categories) {
    if (!category.slug || category.pageCount === 0) continue;
    for (const id of category.sourceIds) {
      categorySlugById.set(id, category.slug);
    }
    routes.push({ url: buildCanonicalUrl(`/coloring-pages/${category.slug}`) });
  }

  const collectionImages = await getAllCollectionImages(pages.map(page => page.id));
  const byPage = new Map<number, typeof collectionImages>();
  for (const image of collectionImages) byPage.set(image.pageId, [...(byPage.get(image.pageId) || []), image]);
  for (const page of pages) {
    const categorySlug =
      page.categoryId === null ? undefined : categorySlugById.get(page.categoryId);
    if (!page.slug || !categorySlug) continue;

    const extra = byPage.get(page.id) || [];
    const dates = [page.updatedAt, page.publishedAt, ...extra.map(image => image.updatedAt)].filter((date): date is Date => Boolean(date));
    const modified = dates.length ? { lastModified: new Date(Math.max(...dates.map(date => date.getTime()))) } : {};
    const images = [...new Set([page.imageUrl, ...extra.map(image => image.imageUrl)].filter((url): url is string => Boolean(url)))].map(absoluteImageUrl);
    routes.push({
      url: buildCanonicalUrl(`/coloring-pages/${categorySlug}/${page.slug}`),
      ...modified,
      ...(images.length ? { images } : {}),
    });

    // Online editor is a distinct interactive page, not a copy of the printable page.
    if (page.imageUrl || page.hasOnlineVersion) {
      routes.push({
        url: buildCanonicalUrl(`/color-online/${page.slug}`),
        ...modified,
      });
    }
  }

  for (const post of blogPosts) {
    if (!post.slug) continue;
    routes.push({
      url: buildCanonicalUrl(`/blog/${post.slug}`),
      ...(post.publishedAt ? { lastModified: post.publishedAt } : {}),
      ...(post.featuredImage
        ? { images: [absoluteImageUrl(post.featuredImage)] }
        : {}),
    });
  }

  return routes;
}
