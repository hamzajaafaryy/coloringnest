import Breadcrumbs from "@/components/Breadcrumbs";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Contact Us | CraftColoring",
  description: "Get in touch with the CraftColoring team for feedback, category suggestions, or inquiries.",
  path: "/contact/",
});

export default function ContactPage() {
  const breadcrumbItems = [{ label: "Contact", href: "/contact/" }];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900">Contact CraftColoring</h1>
        <p className="text-slate-600 text-sm">
          Have a suggestion, correction, copyright question, or idea for a new coloring category or page? We would love to hear from you.
        </p>
      </div>

      <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Your Name
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Your Email
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Message
          </label>
          <textarea
            rows={5}
            required
            className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tell us what coloring pages you would like to see..."
          />
        </div>

        <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
          The contact form is currently being updated. Please check back soon for direct contact options. For privacy requests, you may also review our <a href="/privacy-policy/" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
