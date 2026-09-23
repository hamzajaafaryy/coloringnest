import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { AdminShell } from "@/components/admin/AdminForm";

export const dynamic = "force-dynamic";

export default async function AdminBlog() {
  const rows = await db.select({ id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug, isPublished: blogPosts.isPublished, publishedAt: blogPosts.publishedAt }).from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  return <AdminShell title="Blog" description="Create, edit and publish SEO-focused articles."><div className="mb-5 flex justify-end"><Link href="/admin/blog/new/" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">+ New article</Link></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50"><tr><th className="px-5 py-4">Title</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Published</th><th className="px-5 py-4"></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-b last:border-0"><td className="px-5 py-4 font-medium text-slate-900">{row.title}</td><td className="px-5 py-4">{row.isPublished ? "Published" : "Draft"}</td><td className="px-5 py-4 text-slate-500">{row.publishedAt ? row.publishedAt.toLocaleDateString("en-US") : "—"}</td><td className="px-5 py-4 text-right"><Link href={`/admin/blog/${row.id}/`} className="font-semibold text-indigo-600">Edit</Link></td></tr>)}</tbody></table></div></AdminShell>;
}
