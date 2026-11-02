import CategoryCollection from "@/components/CategoryCollection";
import { getCategoryBySlugFromDb } from "@/db/queries";
import { constructMetadata, buildCanonicalUrl } from "@/lib/seo";
import { parsePage } from "@/lib/paging";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ category: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params, searchParams }: Props) {
  const { category: slug } = await params;
  const category = await getCategoryBySlugFromDb(slug);
  if (!category) return constructMetadata({ title: "Category Not Found", noindex: true });
  const page = parsePage((await searchParams).page);
  const meta = constructMetadata({
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description || undefined,
    path: `/coloring-pages/${category.slug}/`,
    noindex: category.pageCount === 0,
  });
  return page > 1 ? { ...meta, alternates: { canonical: `${buildCanonicalUrl(`/coloring-pages/${category.slug}`)}?page=${page}` } } : meta;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  return <CategoryCollection slug={category} page={parsePage((await searchParams).page)} />;
}
