import { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/data/categories";
import { COLORING_PAGES } from "@/lib/data/coloringPages";
import { BLOG_POSTS } from "@/lib/data/blogPosts";

const DOMAIN = "https://coloringnest.com";

export default function sitemap(): MetadataRoute.Sitemap {
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
  CATEGORIES.forEach((cat) => {
    routes.push({
      url: `${DOMAIN}/coloring-pages/${cat.slug}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
    routes.push({
      url: `${DOMAIN}/printable-coloring-pages/${cat.slug}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  // Individual Coloring Page URLs & Color Online URLs
  COLORING_PAGES.forEach((page) => {
    routes.push({
      url: `${DOMAIN}/coloring-pages/${page.categorySlug}/${page.slug}/`,
      lastModified: new Date(page.publishedDate),
      changeFrequency: "monthly",
      priority: 0.9,
    });
    routes.push({
      url: `${DOMAIN}/color-online/${page.slug}/`,
      lastModified: new Date(page.publishedDate),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  // Blog Post URLs
  BLOG_POSTS.forEach((post) => {
    routes.push({
      url: `${DOMAIN}/blog/${post.slug}/`,
      lastModified: new Date(post.publishedDate),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  return routes;
}
