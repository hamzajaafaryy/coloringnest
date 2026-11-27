import Link from "next/link";import {getAllPublishedBlogPosts} from "@/db/queries";import {constructMetadata} from "@/lib/seo";
export const dynamic="force-dynamic";
export const metadata=constructMetadata({title:"Coloring Tips and Activities",description:"Read simple coloring tips, print ideas, and family-friendly creative activities from CraftColoring.",path:"/blog/"});
export default async function Blog() {
  const posts = await getAllPublishedBlogPosts();
  return (
    <main className="mx-auto max-w-6xl space-y-7 px-4 py-12 sm:py-16">
      <header className="space-y-3">
        <span className="inline-flex rounded-full border-2 border-[#2b2140] bg-[#c9f2dc] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#2b2140] shadow-[3px_3px_0_#2b2140]">For families &amp; teachers</span>
        <h1 className="text-4xl font-black text-[#2b2140]">Coloring tips and ideas</h1>
        <p className="text-[#514461]">Easy ideas for families and teachers. We are putting together fresh, helpful posts.</p>
      </header>
      {posts.length ? (
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}/`} className="min-h-36 rounded-2xl border-2 border-[#2b2140] bg-white p-5 shadow-[4px_4px_0_rgba(43,33,64,0.14)] transition hover:-translate-y-1 hover:bg-[#fff3d6] hover:shadow-[6px_6px_0_rgba(43,33,64,0.16)]">
              <h2 className="font-black text-[#2b2140]">{post.title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#514461]">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border-2 border-dashed border-[#2b2140] bg-[#fff3d6] p-10 text-[#514461]">No articles yet. Fresh coloring tips are coming soon.</p>
      )}
    </main>
  );
}