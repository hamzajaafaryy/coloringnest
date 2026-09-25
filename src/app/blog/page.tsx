import Link from "next/link";

import { Clock, ArrowRight, User } from "lucide-react";

import Breadcrumbs from "@/components/Breadcrumbs";
import AdPlaceholder from "@/components/AdPlaceholder";

import {
  getAllPublishedBlogPosts,
} from "@/db/queries";

import {
  constructMetadata,
  generateBreadcrumbSchema,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "CraftColoring Blog | Creative Activities & Development Guides",
  description:
    "Read child development articles, fine motor skill guides, printing tips, and adult coloring mandala techniques on the CraftColoring Blog.",
  path: "/blog/",
});

export default async function BlogIndexPage() {
  const posts = await getAllPublishedBlogPosts();

  const breadcrumbItems = [
    { label: "Blog", href: "/blog/" },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <div className="space-y-3 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          CraftColoring Blog
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Coloring Guides, Tips & Child Development
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Discover insights on early fine motor development, home printing
          guides, and stress-relieving mindfulness activities.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              {post.featuredImage && (
                <Link href={`/blog/${post.slug}/`} className="block aspect-[16/9] overflow-hidden bg-slate-100">
                  <img src={post.featuredImage} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </Link>
              )}

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    {post.category}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <Link href={`/blog/${post.slug}/`}>
                  <h2 className="font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="p-6 pt-0 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {post.author}
                </span>

                <Link
                  href={`/blog/${post.slug}/`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-800"
                >
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            No blog posts available
          </h2>

          <p className="mt-2 text-slate-600">
            Check back soon for new CraftColoring articles and guides.
          </p>
        </div>
      )}

      <AdPlaceholder
        slotName="Blog Index Banner"
        format="horizontal"
      />
    </div>
  );
}