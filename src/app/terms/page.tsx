import Breadcrumbs from "@/components/Breadcrumbs";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Terms of Service | ColoringNest",
  description: "Terms of service for using ColoringNest free coloring pages for personal and educational use.",
  path: "/terms/",
});

export default function TermsPage() {
  const breadcrumbItems = [{ label: "Terms of Service", href: "/terms/" }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 prose prose-indigo text-slate-700">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
      <p className="text-sm">Last updated: January 2026</p>

      <h2>1. Permitted Use</h2>
      <p>
        All coloring pages provided on ColoringNest are free for personal, educational, homeschool, and classroom use. You are welcome to print and color as many pages as you like.
      </p>

      <h2>2. Intellectual Property</h2>
      <p>
        The original vector artwork, website design, and logos are the property of ColoringNest. Redistribution of artwork files for commercial sale or paid collections is prohibited without prior consent.
      </p>
    </div>
  );
}
