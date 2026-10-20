import CategoryCollection from "@/components/CategoryCollection";
import { getCategoryBySlugFromDb } from "@/db/queries";
import { constructMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props) {
  const { category: slug } = await params;
  const category = await getCategoryBySlugFromDb(slug);
  if (!category) return constructMetadata({ title: "Category Not Found", noindex: true });
  return constructMetadata({
    title: `Printable ${category.name}`,
    description: category.seoDescription || category.description || undefined,
    path: `/printable-coloring-pages/${category.slug}/`,
    noindex: category.pageCount === 0,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  return <CategoryCollection slug={category} printable />;
}
