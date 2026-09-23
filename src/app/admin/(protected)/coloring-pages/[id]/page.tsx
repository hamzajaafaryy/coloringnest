import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, coloringPages } from "@/db/schema";
import { deleteColoringPage, updateColoringPage } from "@/lib/admin-crud-actions";
import { AdminShell, Check, Field, Submit, TextArea } from "@/components/admin/AdminForm";

export const dynamic = "force-dynamic";

export default async function EditColoringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const pageId = Number(id); if (!Number.isFinite(pageId)) notFound();
  const [page] = await db.select().from(coloringPages).where(eq(coloringPages.id, pageId)).limit(1); if (!page) notFound();
  const categoryRows = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(categories.name);
  const update = updateColoringPage.bind(null, pageId); const remove = deleteColoringPage.bind(null, pageId);
  return <AdminShell title="Edit Coloring Page" description={page.title}>
    <form action={update} className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <section className="grid gap-5 md:grid-cols-2"><Field label="Title" name="title" defaultValue={page.title} required /><Field label="Slug" name="slug" defaultValue={page.slug} /><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Category</span><select name="categoryId" defaultValue={page.categoryId?.toString() ?? ""} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"><option value="">No category</option>{categoryRows.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><Field label="Image URL" name="imageUrl" defaultValue={page.imageUrl} /><Field label="SVG URL" name="svgUrl" defaultValue={page.svgUrl} /><Field label="Alt text" name="altText" defaultValue={page.altText} required /></section>
      <TextArea label="Description" name="description" defaultValue={page.description} /><TextArea label="SVG content" name="svgContent" defaultValue={page.svgContent} rows={8} />
      <section className="grid gap-5 md:grid-cols-3"><Field label="Tags" name="tags" defaultValue={page.tags?.join(", ")} /><Field label="Age range" name="ageRange" defaultValue={page.ageRange} /><Field label="Difficulty" name="difficulty" defaultValue={page.difficulty} /></section>
      <section className="grid gap-5 md:grid-cols-2"><Field label="SEO title" name="seoTitle" defaultValue={page.seoTitle} /><Field label="SEO description" name="seoDescription" defaultValue={page.seoDescription} /></section>
      <div className="flex flex-wrap gap-6"><Check label="Published" name="isPublished" defaultChecked={page.isPublished ?? false} /><Check label="Featured" name="featured" defaultChecked={page.featured ?? false} /><Check label="Popular" name="popular" defaultChecked={page.popular ?? false} /></div>
      <div className="flex items-center gap-3"><Submit label="Save changes" /><Link href="/admin/coloring-pages/" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancel</Link></div>
    </form>
    <form action={remove} className="mt-6"><button type="submit" className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600">Delete this page</button></form>
  </AdminShell>;
}
