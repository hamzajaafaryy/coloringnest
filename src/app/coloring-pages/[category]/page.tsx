import CategoryCollection from "@/components/CategoryCollection";
import { getPublishedCardPage } from "@/db/page-cards";
import { getCategoryBySlugFromDb } from "@/db/queries";
import { constructMetadata, buildPaginatedCanonicalUrl } from "@/lib/seo";
import { parsePage } from "@/lib/paging";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ category: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const category = await getCategoryBySlugFromDb(slug);
  if (!category) return constructMetadata({ title: "Category Not Found", noindex: true });
  const page = parsePage((await searchParams).page);
  const listing = await getPublishedCardPage({ categorySlug: category.slug, page });
  const meta = constructMetadata({
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description || undefined,
    path: `/coloring-pages/${category.slug}/`,
    noindex: category.pageCount === 0,
  });
  return { ...meta, alternates: { canonical: buildPaginatedCanonicalUrl(`/coloring-pages/${category.slug}`, listing.page) } };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  return <CategoryCollection slug={category} page={parsePage((await searchParams).page)} />;
}
