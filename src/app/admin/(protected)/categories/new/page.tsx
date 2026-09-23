import Link from "next/link";
import { createCategory } from "@/lib/admin-crud-actions";
import { AdminShell, Check, Field, Submit, TextArea } from "@/components/admin/AdminForm";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default function NewCategory() {
  return <AdminShell title="New Category" description="Create a crawlable category with SEO metadata."><form action={createCategory} className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <section className="grid gap-5 md:grid-cols-2">
      <Field label="Name" name="name" required />
      <Field label="Slug" name="slug" placeholder="unicorn" />
      <ImageUploadField label="Category image" name="imageUrl" slugField="slug" kind="image" />
      <Field label="Icon name" name="iconName" />
      <Field label="Hero color" name="heroColor" placeholder="#EEF2FF" />
      <Field label="Subcategories" name="subcategories" placeholder="Cute Unicorns, Rainbow Unicorns" />
    </section>
    <TextArea label="Description" name="description" />
    <section className="grid gap-5 md:grid-cols-2"><Field label="SEO title" name="seoTitle" /><Field label="SEO description" name="seoDescription" /></section>
    <div className="flex flex-wrap gap-6"><Check label="Featured" name="featured" /><Check label="Popular" name="popular" /></div>
    <div className="flex gap-3"><Submit label="Create category" /><Link href="/admin/categories/" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancel</Link></div>
  </form></AdminShell>;
}
