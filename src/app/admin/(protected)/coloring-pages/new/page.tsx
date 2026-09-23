import Link from "next/link";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { createColoringPage } from "@/lib/admin-crud-actions";
import { AdminShell, Check, Field, Submit, TextArea } from "@/components/admin/AdminForm";

export const dynamic = "force-dynamic";

export default async function NewColoringPage() {
  const categoryRows = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(categories.name);
  return <AdminShell title="New Coloring Page" description="Add a page and its SEO metadata.">
    <form action={createColoringPage} className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <section className="grid gap-5 md:grid-cols-2"><Field label="Title" name="title" required placeholder="Unicorn Rainbow Coloring Page" /><Field label="Slug" name="slug" placeholder="unicorn-rainbow-coloring-page" /><label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">Category</span><select name="categoryId" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"><option value="">No category</option>{categoryRows.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><Field label="Image URL" name="imageUrl" /><Field label="SVG URL" name="svgUrl" /><Field label="Alt text" name="altText" required /></section>
      <TextArea label="Description" name="description" rows={5} /><TextArea label="SVG content" name="svgContent" rows={8} placeholder="Optional inline SVG markup" />
      <section className="grid gap-5 md:grid-cols-3"><Field label="Tags" name="tags" placeholder="unicorn, rainbow, fantasy" /><Field label="Age range" name="ageRange" placeholder="4-8" /><Field label="Difficulty" name="difficulty" placeholder="Easy" /></section>
      <section className="grid gap-5 md:grid-cols-2"><Field label="SEO title" name="seoTitle" /><Field label="SEO description" name="seoDescription" /></section>
      <div className="flex flex-wrap gap-6"><Check label="Published" name="isPublished" /><Check label="Featured" name="featured" /><Check label="Popular" name="popular" /></div>
      <div className="flex items-center gap-3"><Submit label="Create page" /><Link href="/admin/coloring-pages/" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancel</Link></div>
    </form>
  </AdminShell>;
}
