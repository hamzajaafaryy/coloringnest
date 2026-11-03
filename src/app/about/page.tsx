import Link from "next/link";
import { constructMetadata, generateOrganizationSchema, serializeJsonLd } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "About CraftColoring",
  description: "Learn about CraftColoring's original printable art, our creative process, and Anna Bloom, our fictional creative guide.",
  path: "/about/",
});

export default function About() {
  return (
    <main className="bg-[#fffdfa] px-4 py-12 text-[#392653] sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(generateOrganizationSchema()) }} />
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="max-w-3xl space-y-5">
          <span className="inline-flex rounded-full bg-[#f3e7ff] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#8147c8]">Our story</span>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Little art, big smiles.</h1>
          <p className="text-lg leading-8 text-[#6e6179]">
            CraftColoring is a cheerful place to find printable coloring pages for kids, families, and classrooms.
            Every picture is designed to help make coloring time fun and easy to start.
          </p>
        </header>

        <section className="grid items-center gap-8 rounded-[2rem] border border-[#eadff1] bg-gradient-to-br from-[#f3eaff] via-white to-[#fff3d9] p-6 sm:p-9 md:grid-cols-[200px_1fr]" aria-labelledby="anna-heading">
          <div className="mx-auto w-full max-w-[200px] overflow-hidden rounded-[1.5rem] border-4 border-white bg-[#e8d8f6] shadow-lg">
            <img src="/images/anna-bloom-photo.webp" width="176" height="176" alt="AI-generated portrait of the fictional CraftColoring creative character Anna Bloom, seated in an art studio with coloring drawings" className="aspect-square h-auto w-full object-cover" loading="lazy" />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8654a7]">Meet our creative character</p>
            <h2 id="anna-heading" className="text-3xl font-black">Anna Bloom</h2>
            <p className="text-sm font-bold text-[#6d4a91]">CraftColoring's creative guide · Fictional brand persona</p>
            <p className="max-w-2xl leading-7 text-[#594a67]">
              Anna Bloom is a friendly fictional character who represents our love of imagination,
              creativity and sharing printable art. You'll see her as the welcoming face of
              CraftColoring, while the artwork is created under the CraftColoring brand.
            </p>
            <p className="text-xs leading-6 text-[#786b81]">
              Anna is not a real person or a claimed artist or founder. Her portrait is AI-generated.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-[#eadff1] bg-white p-7">
            <h2 className="mb-3 text-xl font-black">How we create</h2>
            <p className="leading-7 text-[#6e6179]">
              CraftColoring develops its coloring page ideas and artwork from scratch using
              digital creative tools, including AI-assisted image generation. We prepare pages
              for printing and, where available, online coloring.
            </p>
          </div>
          <div className="rounded-3xl border border-[#eadff1] bg-white p-7">
            <h2 className="mb-3 text-xl font-black">Artwork credits and use</h2>
            <p className="leading-7 text-[#6e6179]">
              Artwork published under the CraftColoring name is credited to CraftColoring.
              For details about personal and classroom printing, licensing and sharing, please read our{" "}
              <Link href="/terms/" className="font-bold text-[#8147c8] underline underline-offset-4">Terms of Use</Link>.
            </p>
          </div>
        </section>

        <div className="text-center">
          <Link href="/coloring-pages/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#8147c8] px-7 py-3 font-extrabold text-white hover:bg-[#6e34b7]">Explore the coloring pages</Link>
        </div>
      </div>
    </main>
  );
}
