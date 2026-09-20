import Breadcrumbs from "@/components/Breadcrumbs";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Privacy Policy | CraftColoring",
  description: "CraftColoring privacy policy detailing how we protect user privacy and handle data.",
  path: "/privacy-policy/",
});

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [{ label: "Privacy Policy", href: "/privacy-policy/" }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 prose prose-indigo text-slate-700">
      <Breadcrumbs items={breadcrumbItems} />
      <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
      <p className="text-sm">Last updated: January 2026</p>

      <p>
        At CraftColoring (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we prioritize the privacy and safety of our visitors, especially children and families. This Privacy Policy explains our practices regarding data collection.
      </p>

      <h2>1. Account-Free Experience</h2>
      <p>
        CraftColoring does not require user registration or personal account creation to access, download, print, or color any of our coloring pages.
      </p>

      <h2>2. Local Browser Storage</h2>
      <p>
        When you color pages online, your artwork progress is stored locally in your browser&apos;s <code>localStorage</code>. This data stays on your personal device and is not sent to external servers.
      </p>

      <h2>3. Analytics and Cookies</h2>
      <p>
        We may use privacy-preserving website analytics to measure aggregate page visits, popular categories, and system health.
      </p>
    </div>
  );
}
