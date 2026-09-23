import Link from "next/link";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { AdminShell } from "@/components/admin/AdminForm";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const rows = await db.select().from(categories).orderBy(categories.name);
  return <AdminShell title="Categories" description="Manage taxonomy, category pages and SEO metadata.">
    <div className="mb-5 flex justify-end"><Link href="/admin/categories/new/" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">+ New category</Link></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50"><tr><th className="px-5 py-4">Name</th><th className="px-5 py-4">Slug</th><th className="px-5 py-4">Featured</th><th className="px-5 py-4"></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-b last:border-0"><td className="px-5 py-4 font-medium text-slate-900">{row.name}</td><td className="px-5 py-4 text-slate-500">{row.slug}</td><td className="px-5 py-4">{row.featured ? "Yes" : "—"}</td><td className="px-5 py-4 text-right"><Link href={`/admin/categories/${row.id}/`} className="font-semibold text-indigo-600">Edit</Link></td></tr>)}</tbody></table></div>
  </AdminShell>;
}
