import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { deleteBlogPost, updateBlogPost } from "@/lib/admin-crud-actions";
import { AdminShell, Check, Field, Submit, TextArea } from "@/components/admin/AdminForm";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const dynamic = "force-dynamic";

export default async function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const postId = Number(id); if (!Number.isFinite(postId)) notFound();
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId)).limit(1); if (!post) notFound();
  const update = updateBlogPost.bind(null, postId); const remove = deleteBlogPost.bind(null, postId);
  return <AdminShell title="Edit Article" description={post.title}><form action={update} className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <section className="grid gap-5 md:grid-cols-2">
      <Field label="Title" name="title" defaultValue={post.title} required />
      <Field label="Slug" name="slug" defaultValue={post.slug} />
      <Field label="Author" name="author" defaultValue={post.author} />
      <Field label="Category" name="category" defaultValue={post.category} />
      <Field label="Read time" name="readTime" defaultValue={post.readTime} />
      <ImageUploadField label="Featured image" name="featuredImage" slugField="slug" kind="image" defaultValue={post.featuredImage} />
    </section>
    <TextArea label="Excerpt" name="excerpt" defaultValue={post.excerpt} rows={4} />
    <TextArea label="Content" name="content" defaultValue={post.content} rows={18} />
    <Field label="Tags" name="tags" defaultValue={post.tags?.join(", ")} />
    <section className="grid gap-5 md:grid-cols-2"><Field label="SEO title" name="seoTitle" defaultValue={post.seoTitle} /><Field label="SEO description" name="seoDescription" defaultValue={post.seoDescription} /></section>
    <Check label="Published" name="isPublished" defaultChecked={post.isPublished ?? false} />
    <div className="flex gap-3"><Submit label="Save changes" /><Link href="/admin/blog/" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancel</Link></div>
  </form><form action={remove} className="mt-6"><button type="submit" className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600">Delete article</button></form></AdminShell>;
}
