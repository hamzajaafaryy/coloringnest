import Link from "next/link";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Contact",
  description: "Learn how to contact CraftColoring about coloring pages, corrections, privacy, or copyright questions.",
  path: "/contact/",
});

export default function Contact() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <section className="space-y-6 rounded-[2rem] border-2 border-[#2b2140] bg-white p-6 shadow-[6px_6px_0_rgba(43,33,64,0.16)] sm:p-10">
        <span className="inline-flex rounded-full border-2 border-[#2b2140] bg-[#e8f4ff] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#2b2140]">We&apos;re here to help</span>
        <h1 className="text-4xl font-black text-[#2b2140]">Contact CraftColoring</h1>
        <p className="leading-7 text-[#514461]">Found a broken link? Have a question about a picture or a copyright concern? We would like to hear about it.</p>
        {email ? (
          <p className="rounded-2xl border-2 border-[#2b2140] bg-[#fff3d6] p-5 text-lg text-[#2b2140] shadow-[4px_4px_0_#2b2140]">
            Email us at <a className="font-bold underline underline-offset-4" href={`mailto:${email}`}>{email}</a>.
          </p>
        ) : (
          <p className="rounded-2xl border-2 border-[#2b2140] bg-[#fff3d6] p-5 leading-7 text-[#2b2140] shadow-[4px_4px_0_#2b2140]">
            Our contact email is being set up. Please check back for a direct way to reach us. We have removed the old form because it did not send messages.
          </p>
        )}
        <p className="text-sm text-[#514461]">For information about personal data, see our <Link className="font-bold underline underline-offset-4" href="/privacy-policy/">Privacy Policy</Link>.</p>
      </section>
    </main>
  );
}