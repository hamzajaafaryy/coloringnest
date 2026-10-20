import { notFound, permanentRedirect } from "next/navigation";
import ColoringDetail from "@/components/ColoringDetail";
import { getColoringPageByCategoryAndSlug } from "@/db/queries";
import { constructMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const page = await getColoringPageByCategoryAndSlug(category, slug);
  if (!page) return constructMetadata({ title: "Coloring Page Not Found", noindex: true });
  return constructMetadata({
    title: `Printable ${page.title}`,
    description: page.seoDescription || `Print ${page.title.toLowerCase()} for a little coloring time at home or school.`,
    path: `/printable-coloring-pages/${page.categorySlug}/${page.slug}/`,
    image: page.imageUrl || undefined,
  });
}

export default async function ColoringPage({ params }: Props) {
  const { category, slug } = await params;
  const page = await getColoringPageByCategoryAndSlug(category, slug);
  if (!page) notFound();
  if (category !== page.categorySlug) permanentRedirect(`/printable-coloring-pages/${page.categorySlug}/${page.slug}/`);
  return <ColoringDetail page={page} printable />;
}
