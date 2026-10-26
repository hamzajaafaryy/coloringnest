import { notFound, permanentRedirect } from "next/navigation";
import { getColoringPageByCategoryAndSlug } from "@/db/queries";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ category: string; slug: string }> };

async function resolveDestination({ params }: Props): Promise<never> {
  const { category, slug } = await params;
  const page = await getColoringPageByCategoryAndSlug(category, slug);
  if (!page) notFound();
  permanentRedirect(`/coloring-pages/${page.categorySlug}/${page.slug}/`);
}

export const generateMetadata = resolveDestination;
export default resolveDestination;
