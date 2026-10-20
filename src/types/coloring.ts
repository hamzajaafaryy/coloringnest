export interface DbColoringPageCard {
  id: number;
  title: string;
  slug: string | null;

  description: string | null;
  seoDescription?: string | null;
  imageUrl: string | null;
  svgContent: string | null;
  svgUrl?: string | null;
  altText: string | null;

  categoryId: number | null;
  categoryName: string | null;
  categorySlug: string | null;

  ageRange: string | null;
  difficulty: string | null;

  featured: boolean | null;
  popular: boolean | null;
  publishedAt: Date | null;
}