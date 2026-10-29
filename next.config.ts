import type { NextConfig } from "next";
import { categoryRedirectRules } from "./src/lib/category-catalog";
import { resolveSiteOrigin, siteRedirectRules } from "./src/lib/site-urls";

const nextConfig: NextConfig = {
  // Resolve metadata before streaming so missing posts return an HTTP 404.
  htmlLimitedBots: /.*/,
  // Sharp loads libvips dynamically; include its shared libraries in the upload function.
  outputFileTracingIncludes: {
    "/api/admin/upload": ["./node_modules/@img/sharp-*/**/*"],
  },
  async redirects() {
    return [
      ...siteRedirectRules(resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL), process.env.SITE_REDIRECT_FROM_HOSTS),
      ...categoryRedirectRules(),
    ];
  },
};

export default nextConfig;
