import type { NextConfig } from "next";
import { categoryRedirectRules } from "./src/lib/category-catalog";

const nextConfig: NextConfig = {
  // Resolve metadata before streaming so missing posts return an HTTP 404.
  htmlLimitedBots: /.*/,
  // Sharp loads libvips dynamically; include its shared libraries in the upload function.
  outputFileTracingIncludes: {
    "/api/admin/upload": ["./node_modules/@img/sharp-*/**/*"],
  },
  async redirects() {
    return categoryRedirectRules();
  },
};

export default nextConfig;
