import { BLOG_POSTS } from "@/lib/data/blogPosts";

export function normalizeBrand(value: string): string {
  return value.replace(/\bColoring\s*Nest\b/gi, "CraftColoring");
}

// Repair an observed pasted field boundary without discarding ordinary long tags.
export function cleanColoringTags(tags: string[] | null | undefined): string[] {
  const joined = (tags || []).join(", ").split(/\b(?:Difficulty|Age range|SEO title|SEO description)\s*:/i)[0];
  return [...new Set(joined.split(",").map(tag => tag.trim()).filter(Boolean))];
}

type Article = {
  slug: string | null; title: string; content: string | null;
  excerpt: string | null; author: string | null; seoTitle: string | null;
  seoDescription: string | null; featuredImage: string | null;
  readTime: string | null; category: string | null; tags: string[] | null;
};

// Compatibility for known starter articles already stored in Supabase.
// Apply editorial replacements only while their old seed text is still present.
export function prepareArticle<T extends Article>(post: T): T {
  const result = { ...post };
  const replacement = BLOG_POSTS.find(item => item.slug === post.slug);
  const oldSeed = /complex neuromuscular pathways|The Amygdala Connection|printing ONLY your high-resolution/i.test(post.content || "");
  if (replacement && oldSeed) {
    for (const field of ["title", "content", "excerpt", "author", "seoTitle", "seoDescription", "readTime", "category", "tags"] as const) {
      Object.assign(result, { [field]: replacement[field] });
    }
  }
  for (const field of ["title", "content", "excerpt", "author", "seoTitle", "seoDescription", "category"] as const) {
    const value = result[field];
    if (typeof value === "string") Object.assign(result, { [field]: normalizeBrand(value) });
  }
  if (/^Dr\. (Elena Rostova|Sarah Lin),/.test(result.author || "")) result.author = "CraftColoring Team";
  if (/^\/images\/blog\/(coloring-benefits|printing-guide|mandala-zen)\.jpg$/.test(result.featuredImage || "")) {
    result.featuredImage = result.featuredImage!.replace(/\.jpg$/, ".svg");
  }
  result.readTime = `${Math.max(1, Math.ceil((result.content || "").split(/\s+/).filter(Boolean).length / 200))} min read`;
  return result;
}
