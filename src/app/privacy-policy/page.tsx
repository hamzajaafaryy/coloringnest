import Breadcrumbs from "@/components/Breadcrumbs";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Privacy Policy",
  description:
    "Read the CraftColoring Privacy Policy covering cookies, analytics, local storage, advertising, third-party services, and your privacy choices.",
  path: "/privacy-policy/",
});

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [{ label: "Privacy Policy", href: "/privacy-policy/" }];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 prose prose-indigo text-slate-700">
      <Breadcrumbs items={breadcrumbItems} />

      <header>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-sm">Last updated: September 25, 2026</p>
      </header>

      <p>
        This Privacy Policy explains how CraftColoring ("CraftColoring", "we",
        "us", or "our") handles information when you visit and use
        craftcoloring.com. We aim to keep the service simple, useful, and
        privacy-conscious for children, families, teachers, and adult users.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        You can browse coloring pages and use the online coloring tools without
        creating an account. We do not require you to provide your name,
        address, phone number, or payment information to use the core website.
      </p>
      <p>
        If you contact us, we may receive the information you choose to include
        in your message, such as your name and email address, and we use it only
        to respond to your request and operate the service.
      </p>

      <h2>2. Local Storage and Online Coloring</h2>
      <p>
        The online coloring editor may use browser local storage to remember
        your coloring progress and preferences. This information is stored on
        your device and is not intentionally sent to CraftColoring as an
        account profile.
      </p>

      <h2>3. Cookies and Similar Technologies</h2>
      <p>
        CraftColoring may use cookies, local storage, and similar technologies
        for essential site functionality, security, analytics, and advertising.
        The exact technologies in use may change as the site evolves.
      </p>

      <h2>4. Analytics</h2>
      <p>
        We may use analytics services to understand aggregate traffic, page
        performance, popular content, and technical errors. Analytics providers
        may process information such as browser type, device information,
        approximate location derived from an IP address, pages viewed, and
        referral information according to their own policies.
      </p>

      <h2>5. Advertising and Google AdSense</h2>
      <p>
        CraftColoring may display advertising from Google AdSense and other
        advertising partners. Advertising providers may use cookies or similar
        technologies to show and measure ads and, where permitted and based on
        applicable consent choices, personalize advertising.
      </p>
      <p>
        Third-party vendors, including Google, may use advertising cookies to
        serve ads based on a user's prior visits to this website or other
        websites. Users can manage personalized advertising choices through
        Google Ads Settings and can learn about some third-party opt-out
        choices through AboutAds.
      </p>
      <ul>
        <li>
          <a href="https://adssettings.google.com/" rel="nofollow">
            Google Ads Settings
          </a>
        </li>
        <li>
          <a href="https://optout.aboutads.info/" rel="nofollow">
            AboutAds opt-out information
          </a>
        </li>
      </ul>

      <h2>6. Third-Party Services</h2>
      <p>
        We may rely on third-party providers for hosting, storage, analytics,
        advertising, security, and other technical services. Those providers
        may process limited technical information as necessary to provide their
        services and are governed by their own privacy policies.
      </p>

      <h2>7. Children's Privacy</h2>
      <p>
        CraftColoring is designed for general audiences and families. We do not
        knowingly require children to create accounts or submit personal
        information to use the core coloring features. Parents or guardians
        who believe a child has submitted personal information can contact us
        so we can review the request.
      </p>

      <h2>8. Your Choices and Rights</h2>
      <p>
        Depending on where you live, you may have rights concerning access,
        correction, deletion, objection, or restriction of personal information.
        You can also control cookies through your browser and applicable
        consent tools. Advertising choices may also be available through the
        advertising provider's settings.
      </p>

      <h2>9. Data Retention and Security</h2>
      <p>
        We retain information only for as long as reasonably necessary for the
        purpose for which it was collected, to operate the website, meet legal
        obligations, resolve disputes, and protect the service. No internet
        transmission or storage system can be guaranteed completely secure.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy when our services, technologies, or
        legal obligations change. The "Last updated" date at the top will show
        when the policy was most recently revised.
      </p>

      <h2>11. Contact</h2>
      <p>
        For privacy questions or requests, please use our{" "}
        <a href="/contact/">Contact page</a>.
      </p>
    </article>
  );
}
