import Breadcrumbs from "@/components/Breadcrumbs";
import { constructMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
const contactEmail = process.env.CONTACT_EMAIL?.trim();
const hasContact = Boolean(contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail));

export function generateMetadata() {
  return constructMetadata({ title: "Contact Us", description: "Contact CraftColoring with suggestions, corrections, copyright questions, or privacy requests.", path: "/contact/", noindex: !hasContact });
}

export default function ContactPage() {
  return <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
    <Breadcrumbs items={[{ label: "Contact", href: "/contact/" }]} />
    <div className="space-y-3"><h1 className="text-3xl font-black text-slate-900">Contact CraftColoring</h1>
      <p className="leading-7 text-slate-600">Have a suggestion for a coloring page, a correction, or a question about using our artwork? You can also contact us about copyright or privacy concerns.</p></div>
    <section className="space-y-4 rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Get in touch</h2>
      {hasContact ? <><a className="cc-safe-wrap font-bold text-blue-800 underline" href={`mailto:${contactEmail}`}>{contactEmail}</a><p className="text-sm leading-6 text-slate-600">Include the page title or URL so we can find the content you mean. Please do not send passwords or sensitive personal information. Children should ask a parent or guardian to contact us.</p></> : <p className="leading-7 text-slate-600">Our public contact address is not available yet. Please check back later.</p>}
    </section>
  </div>;
}
