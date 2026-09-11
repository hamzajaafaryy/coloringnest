import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, User, ArrowLeft, Share2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedColoringPages from "@/components/RelatedColoringPages";
import AdPlaceholder from "@/components/AdPlaceholder";
import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/data/blogPosts";
import { COLORING_PAGES } from "@/lib/data/coloringPages";
import { constructMetadata, generateBreadcrumbSchema, generateArticleSchema } from "@/lib/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((b) => ({
    slug: b.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return constructMetadata({ title: "Article Not Found", noindex: true });
  }

  return constructMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${slug}/`,
    type: "article",
  });
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Blog", href: "/blog/" },
    { label: post.title, href: `/blog/${slug}/` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    url: `https://coloringnest.com/blog/${slug}/`,
    datePublished: post.publishedDate,
    authorName: post.author,
    image: `https://coloringnest.com${post.featuredImage}`,
  });

  const recommendedPages = COLORING_PAGES.slice(0, 4);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="space-y-4 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            {post.category}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
          <span>• Published {post.publishedDate}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold">{post.author}</span>
        </div>
      </header>

      <AdPlaceholder slotName="Article Top Banner" format="horizontal" />

      {/* Article Content */}
      <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed text-base sm:text-lg space-y-6">
        {post.content.split("\n\n").map((paragraph, idx) => {
          if (paragraph.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-2xl font-bold text-slate-900 mt-6 mb-2">
                {paragraph.replace("### ", "")}
              </h3>
            );
          }
          if (paragraph.startsWith("- ")) {
            const items = paragraph.split("\n- ");
            return (
              <ul key={idx} className="list-disc pl-6 space-y-2 text-base">
                {items.map((item, i) => (
                  <li key={i}>{item.replace("- ", "")}</li>
                ))}
              </ul>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      <RelatedColoringPages pages={recommendedPages} title="Try These Free Coloring Pages" />

      <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
        <Link
          href="/blog/"
          className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Articles
        </Link>
      </div>
    </article>
  );
}
