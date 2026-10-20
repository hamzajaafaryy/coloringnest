// Keep the original illustrated category URLs. Import names and older aliases
// resolve to the same public category without deleting any database rows.
const categoryAliases: Record<string, string[]> = {
  animals: ["animal"],
  dinosaurs: ["dinosaur"],
  fantasy: ["fantasy-fairy-tales"],
  flowers: ["flower-garden"],
  food: ["food-sweet-treat"],
  holidays: ["holiday-season"],
  nature: ["nature-landscape"],
  ocean: ["ocean-sea-life"],
  space: ["outer-space"],
  preschool: ["preschool-toddler"],
  princesses: ["princess"],
  unicorn: ["unicorns"],
  vehicles: ["vehicle-car"],
};

// Redirect at the routing layer, before streaming any page HTML.
export function categoryRedirectRules() {
  return Object.entries(categoryAliases).flatMap(([canonical, aliases]) =>
    aliases.flatMap((alias) => ["coloring-pages", "printable-coloring-pages"].map((base) => ({
      source: `/${base}/${alias}/:path*`,
      destination: `/${base}/${canonical}/:path*`,
      permanent: true,
    }))));
}

export function canonicalCategorySlug(value: string): string {
  const slug = value.toLowerCase().replace(/\s+coloring pages?$/g, "")
    .trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return Object.entries(categoryAliases).find(([canonical, aliases]) =>
    canonical === slug || aliases.includes(slug))?.[0] || slug;
}

export function categorySlugs(value: string): string[] {
  const canonical = canonicalCategorySlug(value);
  return [canonical, ...(categoryAliases[canonical] || [])];
}

interface CatalogCategory {
  id: number;
  name: string;
  slug: string | null;
  imageUrl: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  featured: boolean | null;
  popular: boolean | null;
  pageCount: number;
}

export function consolidateCategories<T extends CatalogCategory>(rows: T[]) {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    if (!row.slug) continue;
    const slug = canonicalCategorySlug(row.slug);
    groups.set(slug, [...(groups.get(slug) || []), row]);
  }
  return [...groups].map(([slug, members]) => {
    const sorted = [...members].sort((a, b) =>
      Number(b.slug === slug) - Number(a.slug === slug) ||
      Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl)) || a.id - b.id);
    const primary = sorted[0];
    return {
      ...primary,
      slug,
      imageUrl: sorted.find((row) => row.imageUrl)?.imageUrl || null,
      description: sorted.find((row) => row.description)?.description || null,
      seoTitle: sorted.find((row) => row.seoTitle)?.seoTitle || null,
      seoDescription: sorted.find((row) => row.seoDescription)?.seoDescription || null,
      featured: members.some((row) => row.featured),
      popular: members.some((row) => row.popular),
      pageCount: members.reduce((sum, row) => sum + row.pageCount, 0),
      sourceIds: members.map((row) => row.id),
    };
  }).sort((a, b) => Number(b.pageCount > 0) - Number(a.pageCount > 0) ||
    Number(b.featured) - Number(a.featured) || Number(b.popular) - Number(a.popular) || a.name.localeCompare(b.name));
}
