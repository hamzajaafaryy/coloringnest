import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/search?*", "/admin/"],
    },
    sitemap: "https://craftcoloring.com/sitemap.xml",
  };
}
