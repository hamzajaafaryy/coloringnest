import { MetadataRoute } from "next";

import {
  getAllPublishedColoringPagesWithCategory,
  getAllPublishedCategories,
  getAllPublishedBlogPosts,
} from "@/db/queries";

const DOMAIN = "https://craftcoloring.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, categories, blogPosts] = await Promise.all([
    getAllPublishedColoringPagesWithCategory(),
    getAllPublishedCategories(),
    getAllPublishedBlogPosts(),
  ]);

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${DOMAIN}/`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${DOMAIN}/coloring-pages/`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/printable-coloring-pages/`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/color-online/`,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${DOMAIN}/blog/`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${DOMAIN}/about/`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${DOMAIN}/contact/`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${DOMAIN}/privacy-policy/`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${DOMAIN}/terms/`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Category URLs
  categories.forEach((category) => {
    if (!category.slug) return;

    routes.push({
      url: `${DOMAIN}/coloring-pages/${category.slug}/`,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    routes.push({
      url: `${DOMAIN}/printable-coloring-pages/${category.slug}/`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  // Individual Coloring Page URLs & Color Online URLs
  pages.forEach((page) => {
    if (!page.slug || !page.categorySlug) return;

    const lastModified = page.publishedAt ?? undefined;

    routes.push({
      url: `${DOMAIN}/coloring-pages/${page.categorySlug}/${page.slug}/`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "monthly",
      priority: 0.9,
      ...(page.imageUrl ? { images: [page.imageUrl] } : {}),
    });

    routes.push({
      url: `${DOMAIN}/color-online/${page.slug}/`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // Blog Post URLs
  blogPosts.forEach((post) => {
    if (!post.slug) return;

    routes.push({
      url: `${DOMAIN}/blog/${post.slug}/`,
      ...(post.publishedAt ? { lastModified: post.publishedAt } : {}),
      changeFrequency: "monthly",
      priority: 0.7,
      ...(post.featuredImage ? { images: [post.featuredImage] } : {}),
    });
  });

  return routes;
}
