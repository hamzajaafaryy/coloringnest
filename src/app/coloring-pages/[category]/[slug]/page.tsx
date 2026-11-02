import { notFound, permanentRedirect } from "next/navigation";
import ColoringDetail from "@/components/ColoringDetail";
import { getColoringPageByCategoryAndSlug } from "@/db/queries";
import { buildColoringMetaDescription, constructMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { category, slug } = await params;
  const page = await getColoringPageByCategoryAndSlug(category, slug);
  if (!page) notFound();
  return constructMetadata({
    title: page.seoTitle || page.title,
    description: page.seoDescription || buildColoringMetaDescription({
      title: page.title, category: page.categoryName,
      ageRange: page.ageRange, difficulty: page.difficulty,
    }),
    path: `/coloring-pages/${page.categorySlug}/${page.slug}/`,
    image: page.imageUrl || undefined,
  });
}

export default async function ColoringPage({ params }: Props) {
  const { category, slug } = await params;
  const page = await getColoringPageByCategoryAndSlug(category, slug);
  if (!page) notFound();
  if (category !== page.categorySlug) permanentRedirect(`/coloring-pages/${page.categorySlug}/${page.slug}/`);
  return <ColoringDetail page={page} />;
}
