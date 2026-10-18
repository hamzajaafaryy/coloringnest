import { redirect } from "next/navigation";
import { getAllPublishedColoringPagesWithCategory } from "@/db/queries";
import { constructMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = constructMetadata({
  title: "Find a Random Coloring Page",
  path: "/surprise-me/",
  noindex: true,
});

export default async function SurpriseMe() {
  const pages = (await getAllPublishedColoringPagesWithCategory()).filter(
    (page) => page.slug && page.categorySlug
  );

  if (!pages.length) redirect("/coloring-pages/");

  const page = pages[Math.floor(Math.random() * pages.length)];
  redirect(`/coloring-pages/${page.categorySlug}/${page.slug}/`);
}
