import Breadcrumbs from "@/components/Breadcrumbs";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Terms of Service",
  description:
    "Read the CraftColoring Terms of Service covering website use, coloring artwork, downloads, intellectual property, and acceptable use.",
  path: "/terms/",
});

export default function TermsPage() {
  const breadcrumbItems = [{ label: "Terms of Service", href: "/terms/" }];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 prose prose-indigo text-slate-700">
      <Breadcrumbs items={breadcrumbItems} />

      <header>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Terms of Service
        </h1>
        <p className="text-sm">Last updated: September 25, 2026</p>
      </header>

      <p>
        These Terms of Service govern your use of craftcoloring.com and its
        coloring pages, online coloring tools, articles, and related features.
        By using the website, you agree to use it lawfully and respectfully.
      </p>

      <h2>1. Use of the Website</h2>
      <p>
        You may use CraftColoring for personal, educational, homeschool,
        classroom, and other lawful creative purposes. You must not use the
        website in a way that interferes with its operation, attempts to gain
        unauthorized access, distributes malicious software, or abuses our
        infrastructure.
      </p>

      <h2>2. Coloring Artwork and Website Content</h2>
      <p>
        Unless a page states otherwise, CraftColoring's original artwork,
        website design, branding, text, and software are protected by
        applicable intellectual-property laws. You may use the coloring
        materials for permitted personal and educational activities, but you
        may not represent CraftColoring artwork as your own or create a
        competing paid collection from our files without permission.
      </p>

      <h2>3. Printing and Personal Copies</h2>
      <p>
        Where printing or downloading is provided, you may make reasonable
        copies for your own use, family activities, teaching, homeschool, and
        classroom activities. Do not sell, license, redistribute, or upload our
        original files as a standalone commercial collection.
      </p>

      <h2>4. Online Coloring Tool</h2>
      <p>
        The online coloring editor is provided for creative use. Saved coloring
        progress may be stored locally in your browser. We do not guarantee
        that local browser data will remain available after browser, device,
        storage, or software changes.
      </p>

      <h2>5. Third-Party Services and Advertising</h2>
      <p>
        CraftColoring may use third-party services for hosting, storage,
        analytics, advertising, social sharing, or other functionality. Those
        services may have separate terms and privacy policies. Advertising may
        be displayed on some pages.
      </p>

      <h2>6. Availability and Accuracy</h2>
      <p>
        We work to keep CraftColoring available and accurate, but pages,
        features, artwork, links, and content may change or become temporarily
        unavailable. We do not promise that every feature will always operate
        without interruption or errors.
      </p>

      <h2>7. External Links</h2>
      <p>
        CraftColoring may link to third-party websites. We are not responsible
        for the content, availability, privacy practices, or terms of external
        websites.
      </p>

      <h2>8. Prohibited Activities</h2>
      <ul>
        <li>Attempting to bypass security or access restricted systems.</li>
        <li>Using automated requests that place unreasonable load on the site.</li>
        <li>Uploading or transmitting malware or harmful code.</li>
        <li>Using our content to mislead users about its source or ownership.</li>
        <li>Violating applicable laws or the rights of others.</li>
      </ul>

      <h2>9. Changes to These Terms</h2>
      <p>
        We may update these Terms when the website or applicable requirements
        change. Continued use of the website after an update means you
        acknowledge the revised Terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms can be submitted through our{" "}
        <a href="/contact/">Contact page</a>.
      </p>
    </article>
  );
}
