import { notFound } from "next/navigation";
import Link from "next/link";

import { Clock, User, ArrowLeft } from "lucide-react";

import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedColoringPages from "@/components/RelatedColoringPages";
import AdPlaceholder from "@/components/AdPlaceholder";
import ArticleContent from "@/components/ArticleContent";
import { getPublishedCardPage } from "@/db/page-cards";

import {
  getBlogPostBySlugFromDb,
} from "@/db/queries";

import {
  constructMetadata,
  generateBreadcrumbSchema,
  generateArticleSchema,
  SITE_CONFIG,
  buildCanonicalUrl,
  serializeJsonLd,
} from "@/lib/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";



export async function generateMetadata({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;

  const post = await getBlogPostBySlugFromDb(slug);

  if (!post) {
    return constructMetadata({
      title: "Article Not Found",
      noindex: true,
    });
  }

  return constructMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
    path: `/blog/${slug}/`,
    image: post.featuredImage || undefined,
    type: "article",
  });
}

export default async function BlogPostDetailPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;

  const post = await getBlogPostBySlugFromDb(slug);

  if (!post) {
    notFound();
  }

  const { pages: recommendedPages } = await getPublishedCardPage({ limit: 4 });

  const breadcrumbItems = [
    {
      label: "Blog",
      href: "/blog/",
    },
    {
      label: post.title,
      href: `/blog/${slug}/`,
    },
  ];

  const breadcrumbSchema =
    generateBreadcrumbSchema(breadcrumbItems);

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : undefined;

  const articleImage = new URL(post.featuredImage || SITE_CONFIG.ogImage, `${SITE_CONFIG.domain}/`).href;

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.seoDescription || post.excerpt || "",
    url: buildCanonicalUrl(`/blog/${slug}`),
    datePublished: publishedDate,
    authorName: post.author || "CraftColoring",
    image: articleImage,
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(articleSchema),
        }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="space-y-4 border-b-2 border-dashed border-[#2b2140]/25 pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#625973]">
          {post.category && (
            <span className="rounded-full border-2 border-[#2b2140] bg-[#ffd23f] px-3 py-1 font-bold uppercase tracking-wider text-[#2b2140]">
              {post.category}
            </span>
          )}

          {post.readTime && (
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          )}

          {post.publishedAt && (
            <span>
              • Published{" "}
              {new Date(post.publishedAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-black leading-tight tracking-tight text-[#2b2140] sm:text-5xl">
          {post.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-[#514461]">
          <User className="h-4 w-4 text-[#59398a]" />

          <span className="font-semibold">
            {post.author || "CraftColoring"}
          </span>
        </div>
      </header>

      {post.featuredImage && (
        <figure className="overflow-hidden rounded-3xl border-2 border-[#2b2140] bg-white p-2 shadow-[6px_6px_0_rgba(43,33,64,0.16)]">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full aspect-[16/9] object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </figure>
      )}

      <AdPlaceholder
        slotName="Article Top Banner"
        format="horizontal"
      />

      <ArticleContent content={post.content || ""} />

      <RelatedColoringPages
        pages={recommendedPages}
        title="Try These Free Coloring Pages"
      />

      <div className="flex items-center justify-between border-t-2 border-dashed border-[#2b2140]/25 pt-6">
        <Link
          href="/blog/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#59398a] underline-offset-4 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Articles
        </Link>
      </div>
    </article>
  );
}
