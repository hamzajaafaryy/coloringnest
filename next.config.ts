import type { NextConfig } from "next";
import { categoryRedirectRules } from "./src/lib/category-catalog";

const nextConfig: NextConfig = {
  async redirects() {
    return categoryRedirectRules();
  },
};

export default nextConfig;
