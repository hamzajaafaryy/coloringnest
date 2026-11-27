import Link from "next/link";
import { constructMetadata, generateOrganizationSchema, serializeJsonLd } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "About CraftColoring",
  description: "Learn about CraftColoring's original printable art, our creative process, and Anna Bloom, our fictional creative guide.",
  path: "/about/",
});

export default function About() {
  return (
    <main className="bg-[#fffaf0] px-4 py-12 text-[#2b2140] sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateOrganizationSchema()) }} />
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="max-w-3xl space-y-5">
          <span className="inline-flex rounded-full border-2 border-[#2b2140] bg-[#ffd23f] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#2b2140] shadow-[3px_3px_0_#2b2140]">Our story</span>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Little art, big smiles.</h1>
          <p className="text-lg leading-8 text-[#514461]">
            CraftColoring is a cheerful place to find printable coloring pages for kids, families, and classrooms.
            Every picture is designed to help make coloring time fun and easy to start.
          </p>
        </header>

        <section className="grid items-center gap-8 rounded-[2rem] border-2 border-[#2b2140] bg-[#e8f4ff] p-6 shadow-[6px_6px_0_rgba(43,33,64,0.16)] sm:p-9 md:grid-cols-[200px_1fr]" aria-labelledby="anna-heading">
          <div className="mx-auto w-full max-w-[200px] overflow-hidden rounded-[1.5rem] border-4 border-[#2b2140] bg-[#fffaf0] shadow-[5px_5px_0_#2b2140]">
            <picture className="block">
              <source srcSet="/images/anna-bloom-640-v2.avif" type="image/avif" />
              <img src="/images/anna-bloom-photo.webp" width="640" height="640" alt="Portrait of Anna Bloom, CraftColoring creative character, sitting at an art table with coloring pages" className="aspect-square h-auto w-full object-cover" loading="lazy" decoding="async" />
            </picture>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8654a7]">Meet our creative character</p>
            <h2 id="anna-heading" className="text-3xl font-black">Anna Bloom</h2>
            <p className="text-sm font-bold text-[#6d4a91]">CraftColoring&apos;s creative guide · Fictional brand persona</p>
            <p className="max-w-2xl leading-7 text-[#3d304d]">
              Anna Bloom is a friendly fictional character who represents our love of imagination,
              creativity and sharing printable art.               You&apos;ll see her as the welcoming face of
              CraftColoring, while the artwork is created under the CraftColoring brand.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border-2 border-[#2b2140] bg-white p-7 shadow-[5px_5px_0_rgba(43,33,64,0.14)]">
            <h2 className="mb-3 text-xl font-black">How we create</h2>
            <p className="leading-7 text-[#514461]">
              CraftColoring develops its coloring page ideas and artwork from scratch using
              digital creative tools, including AI-assisted image generation. We prepare pages
              for printing and, where available, online coloring.
            </p>
          </div>
          <div className="rounded-3xl border-2 border-[#2b2140] bg-white p-7 shadow-[5px_5px_0_rgba(43,33,64,0.14)]">
            <h2 className="mb-3 text-xl font-black">Artwork credits and use</h2>
            <p className="leading-7 text-[#514461]">
              Artwork published under the CraftColoring name is credited to CraftColoring.
              For details about personal and classroom printing, licensing and sharing, please read our{" "}
              <Link href="/terms/" className="font-bold text-[#59398a] underline underline-offset-4">Terms of Use</Link>.
            </p>
          </div>
        </section>

        <div className="text-center">
          <Link href="/coloring-pages/" className="cc-sticker cc-sticker-red">Explore the coloring pages</Link>
        </div>
      </div>
    </main>
  );
}
