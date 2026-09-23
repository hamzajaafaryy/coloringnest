import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, coloringPages } from "@/db/schema";
import { AdminShell } from "@/components/admin/AdminForm";

export const dynamic = "force-dynamic";

export default async function AdminColoringPages() {
  const pages = await db.select({ id: coloringPages.id, title: coloringPages.title, slug: coloringPages.slug, isPublished: coloringPages.isPublished, categoryName: categories.name }).from(coloringPages).leftJoin(categories, eq(coloringPages.categoryId, categories.id)).orderBy(desc(coloringPages.publishedAt));
  return <AdminShell title="Coloring Pages" description="Create, edit and publish coloring pages, images, SVG and SEO.">
    <div className="mb-5 flex justify-end"><Link href="/admin/coloring-pages/new/" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">+ New coloring page</Link></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50"><tr><th className="px-5 py-4">Title</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Status</th><th className="px-5 py-4"></th></tr></thead><tbody>{pages.map((page) => <tr key={page.id} className="border-b last:border-0"><td className="px-5 py-4 font-medium text-slate-900">{page.title}</td><td className="px-5 py-4 text-slate-500">{page.categoryName ?? "—"}</td><td className="px-5 py-4">{page.isPublished ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Published</span> : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Draft</span>}</td><td className="px-5 py-4 text-right"><Link href={`/admin/coloring-pages/${page.id}/`} className="font-semibold text-indigo-600">Edit</Link></td></tr>)}</tbody></table></div>
  </AdminShell>;
}
