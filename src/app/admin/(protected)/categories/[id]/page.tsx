import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { deleteCategory, updateCategory } from "@/lib/admin-crud-actions";
import { AdminShell, Check, Field, Submit, TextArea } from "@/components/admin/AdminForm";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

export default async function EditCategory({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const categoryId = Number(id); if (!Number.isFinite(categoryId)) notFound();
  const [category] = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1); if (!category) notFound();
  const update = updateCategory.bind(null, categoryId); const remove = deleteCategory.bind(null, categoryId);
  return <AdminShell title="Edit Category" description={category.name}><form action={update} className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <section className="grid gap-5 md:grid-cols-2">
      <Field label="Name" name="name" defaultValue={category.name} required />
      <Field label="Slug" name="slug" defaultValue={category.slug} />
      <ImageUploadField label="Category image" name="imageUrl" slugField="slug" kind="image" defaultValue={category.imageUrl} />
      <Field label="Icon name" name="iconName" defaultValue={category.iconName} />
      <Field label="Hero color" name="heroColor" defaultValue={category.heroColor} />
      <Field label="Subcategories" name="subcategories" defaultValue={category.subcategories?.join(", ")} />
    </section>
    <TextArea label="Description" name="description" defaultValue={category.description} />
    <section className="grid gap-5 md:grid-cols-2"><Field label="SEO title" name="seoTitle" defaultValue={category.seoTitle} /><Field label="SEO description" name="seoDescription" defaultValue={category.seoDescription} /></section>
    <div className="flex flex-wrap gap-6"><Check label="Featured" name="featured" defaultChecked={category.featured ?? false} /><Check label="Popular" name="popular" defaultChecked={category.popular ?? false} /></div>
    <div className="flex gap-3"><Submit label="Save changes" /><Link href="/admin/categories/" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancel</Link></div>
  </form><form action={remove} className="mt-6"><button type="submit" className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600">Delete category</button></form></AdminShell>;
}
