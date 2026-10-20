export const STUDIO_CATEGORIES = ["Animal", "Christmas", "Adults", "Dinosaur", "Easter", "Fantasy & Fairy Tales", "Flower & Garden", "Food & Sweet Treat", "Halloween", "Holiday & Season", "Kindergarten", "Mandala", "Nature & Landscape", "Ocean & Sea Life", "Outer Space", "Preschool & Toddler", "Princess", "Sports", "Unicorn", "Vehicle & Car"];

export interface StudioSeo {
  title: string; slug: string; seoTitle: string; seoDescription: string;
  description: string; primaryKeyword: string; keywords: string[];
  altText: string; category: string; tags: string[]; ageRange: string;
  difficulty: string; faqs: { question: string; answer: string }[];
}

export const SEO_RULES = [
  { key: "title", label: "Page title", min: 35, max: 75, unit: "chars" },
  { key: "slug", label: "URL slug", min: 15, max: 85, unit: "chars" },
  { key: "seoTitle", label: "SEO title", min: 45, max: 60, unit: "chars" },
  { key: "seoDescription", label: "Meta description / card summary", min: 140, max: 160, unit: "chars" },
  { key: "description", label: "Article", min: 250, max: 350, unit: "words" },
  { key: "primaryKeyword", label: "Primary search phrase", min: 3, max: 7, unit: "words" },
  { key: "keywords", label: "Related search phrases", min: 4, max: 6, unit: "items" },
  { key: "altText", label: "Descriptive image alt text", min: 20, max: 180, unit: "chars" },
  { key: "tags", label: "Tags", min: 4, max: 6, unit: "items" },
  { key: "faqs", label: "Questions", min: 3, max: 3, unit: "items" },
] as const;

export const wordCount = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
export function fieldCount(value: unknown, unit: "chars" | "words" | "items") {
  if (unit === "items") return Array.isArray(value) ? value.length : 0;
  if (typeof value !== "string") return 0;
  return unit === "words" ? wordCount(value) : value.length;
}

export function validateStudioSeo(value: unknown): { seo: StudioSeo | null; issues: string[] } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { seo: null, issues: ["JSON must be one object."] };
  const input = value as Record<string, unknown>;
  const issues: string[] = [];
  const string = (key: string) => typeof input[key] === "string" ? input[key].trim() : "";
  const strings = (key: string) => {
    const items = input[key];
    if (!Array.isArray(items) || items.some(item => typeof item !== "string" || !item.trim() || item.length > 100)) {
      issues.push(`${key} must be an array of non-empty strings (max 100 characters each).`);
      return [];
    }
    return [...new Set(items.map(item => item.trim()))];
  };
  const rawFaqs = Array.isArray(input.faqs) ? input.faqs : [];
  const faqs = rawFaqs.map(item => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return { question: "", answer: "" };
    const row = item as Record<string, unknown>;
    return { question: typeof row.question === "string" ? row.question.trim() : "", answer: typeof row.answer === "string" ? row.answer.trim() : "" };
  });
  const seo: StudioSeo = {
    title: string("title"), slug: string("slug"), seoTitle: string("seoTitle"),
    seoDescription: string("seoDescription"), description: string("description"),
    primaryKeyword: string("primaryKeyword"), keywords: strings("keywords"), altText: string("altText"),
    category: string("category"), tags: strings("tags"), ageRange: string("ageRange"),
    difficulty: string("difficulty"), faqs,
  };
  for (const rule of SEO_RULES) {
    const count = fieldCount(seo[rule.key], rule.unit);
    if (count < rule.min || count > rule.max) issues.push(`${rule.label}: ${count}; expected ${rule.min}–${rule.max} ${rule.unit}.`);
  }
  if (!seo.title.endsWith("Coloring Page")) issues.push("Page title must end in Coloring Page.");
  if (!seo.seoTitle.endsWith("| CraftColoring")) issues.push("SEO title must end in | CraftColoring.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(seo.slug)) issues.push("Slug must use lowercase words separated by hyphens.");
  if (!STUDIO_CATEGORIES.includes(seo.category)) issues.push("Choose an approved category.");
  if (!["Easy", "Medium", "Hard"].includes(seo.difficulty)) issues.push("Difficulty must be Easy, Medium, or Hard.");
  if (!seo.ageRange || seo.ageRange.length > 50) issues.push("Age range must contain 1–50 characters.");
  if (faqs.some(faq => !faq.question || faq.question.length > 250 || wordCount(faq.answer) < 35 || wordCount(faq.answer) > 70)) issues.push("Each FAQ needs a question (max 250 characters) and an answer of 35–70 words.");
  return { seo, issues };
}
