import Link from "next/link";
import { Download, PencilLine, Sparkles, WandSparkles } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import NameColoringStudio from "@/components/name-coloring/NameColoringStudio";
import { constructMetadata, generateBreadcrumbSchema, generateFAQSchema, serializeJsonLd } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Name Coloring Page Generator",
  description: "Create a free name coloring page with bubble letters, butterflies, flowers, space or dinosaurs. Print, download PNG or SVG, or color your name online.",
  path: "/name-coloring/",
});

const breadcrumbs = [{ label: "Name Coloring", href: "/name-coloring/" }];
const faqs = [
  { question: "Is the name coloring page generator free?", answer: "Yes. Create a page, print it, download the PNG or SVG, or color it online without an account." },
  { question: "Which names can I use?", answer: "Use a name of up to 18 characters with Latin letters, spaces, hyphens or apostrophes. Many accented letters, such as É and Ñ, are supported. Names appear in capital bubble letters, with room inside each letter to color." },
  { question: "Can I choose A4 or US Letter paper?", answer: "Yes. Select your paper size before downloading or printing. In your browser’s print settings, choose the same paper size and fit to page. You can also choose Save as PDF there if your browser offers it." },
  { question: "What is the tracing row for?", answer: "It adds a smaller, dotted version of the name below the picture. Children can trace the letters with a pencil before or after coloring their page." },
  { question: "Can I color my name on a phone or tablet?", answer: "Yes. Choose Color Online, pick a color, and tap inside a letter or decoration with the fill bucket. You can also use the brush and eraser, undo a change, and download the colored picture." },
];

export default function NameColoringPage() {
  return <div className="name-coloring-print-root min-w-0 bg-[#fffdfa] text-[#38294d]">
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateBreadcrumbSchema(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateFAQSchema(faqs)) }} />
      <Breadcrumbs items={breadcrumbs} />
      <header className="mb-7 mt-6 max-w-3xl sm:mb-9">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e9d9f4] bg-[#f4eafb] px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-[#7c43ab]"><Sparkles aria-hidden="true" className="h-3.5 w-3.5" /> Free name coloring page generator</span>
        <h1 className="mt-4 text-[clamp(2rem,4.5vw,3.1rem)] font-black leading-[1.12] tracking-tight">A coloring page with<br className="hidden sm:block" /> <span className="text-[#8b49c5]">your name on it.</span></h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7c6a86] sm:text-base">Make a little something that&apos;s all yours. Add your name, choose a world of doodles, and bring your bubble letters to life.</p>
      </header>
      <NameColoringStudio />

      <section aria-labelledby="name-how-heading" className="mt-12 rounded-[1.8rem] border border-[#eee1db] bg-[#fff6e9] p-5 sm:mt-16 sm:p-8">
        <h2 id="name-how-heading" className="text-2xl font-black">A name, a little imagination, and you</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[{ Icon: PencilLine, title: "Make it personal", text: "Use your name, a nickname, or a friend’s name. The letters change as you type." }, { Icon: WandSparkles, title: "Choose your world", text: "Float with butterflies, grow a garden, explore space or meet a friendly dinosaur." }, { Icon: Download, title: "Bring on the colors", text: "Print a fresh sheet for your crayons, or open the online tools and start coloring." }].map(({ Icon, title, text }) => <div key={title}><Icon aria-hidden="true" className="h-6 w-6 text-[#9c6a40]" /><h3 className="mt-3 font-extrabold text-[#5c3f58]">{title}</h3><p className="mt-2 text-sm leading-7 text-[#806b7d]">{text}</p></div>)}
        </div>
      </section>
      <section aria-labelledby="name-faq-heading" className="mx-auto mt-12 max-w-3xl sm:mt-16">
        <h2 id="name-faq-heading" className="mb-5 text-2xl font-black">A few things before you color</h2>
        <div className="space-y-3">{faqs.map(faq => <details key={faq.question} className="group rounded-2xl border border-[#e9dfef] bg-white p-5 open:bg-[#fdfaff]"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold [&::-webkit-details-marker]:hidden">{faq.question}<span aria-hidden="true" className="text-xl text-[#9b6bc0] group-open:rotate-45">+</span></summary><p className="mt-3 text-sm leading-7 text-[#7c6b86]">{faq.answer}</p></details>)}</div>
        <p className="mt-7 text-center text-sm leading-7 text-[#7d6b86]">More pictures for your coloring table? <Link className="font-bold text-[#7940ab] underline underline-offset-4" href="/coloring-pages/">Explore our coloring pages</Link>.</p>
      </section>
    </div>
  </div>;
}
