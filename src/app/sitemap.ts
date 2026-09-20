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
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${DOMAIN}/coloring-pages/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${DOMAIN}/printable-coloring-pages/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/free-coloring-pages/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/blog/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${DOMAIN}/about/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${DOMAIN}/contact/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${DOMAIN}/privacy-policy/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${DOMAIN}/terms/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Category URLs
  categories.forEach((category) => {
    if (!category.slug) return;

    routes.push({
      url: `${DOMAIN}/coloring-pages/${category.slug}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    routes.push({
      url: `${DOMAIN}/printable-coloring-pages/${category.slug}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  // Individual Coloring Page URLs & Color Online URLs
  pages.forEach((page) => {
    if (!page.slug || !page.categorySlug) return;

    const lastModified = page.publishedAt ?? new Date();

    routes.push({
      url: `${DOMAIN}/coloring-pages/${page.categorySlug}/${page.slug}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    });

    routes.push({
      url: `${DOMAIN}/color-online/${page.slug}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // Blog Post URLs
  blogPosts.forEach((post) => {
    if (!post.slug) return;

    routes.push({
      url: `${DOMAIN}/blog/${post.slug}/`,
      lastModified: post.publishedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  return routes;
}