import CollectionSheetsField from "@/components/admin/CollectionSheetsField";
import { getAdditionalSheets } from "@/db/coloring-sheets";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, coloringPages } from "@/db/schema";
import { deleteColoringPage, updateColoringPage } from "@/lib/admin-crud-actions";
import { AdminShell, Check, Field, Submit, TextArea } from "@/components/admin/AdminForm";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import DeleteConfirmButton from "@/components/admin/DeleteConfirmButton";
import SeoMetadataFields from "@/components/admin/SeoMetadataFields";

export const dynamic = "force-dynamic";

export default async function EditColoringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageId = Number(id);
  if (!Number.isFinite(pageId)) notFound();

  const [page] = await db.select().from(coloringPages).where(eq(coloringPages.id, pageId)).limit(1);
  if (!page) notFound();

  const categoryRows = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(categories.name);
  const sheets = await getAdditionalSheets(pageId);
  const update = updateColoringPage.bind(null, pageId);
  const remove = deleteColoringPage.bind(null, pageId);

  return (
    <AdminShell title="Edit Coloring Page" description={page.title}>
      <form action={update} className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <section className="grid gap-5 md:grid-cols-2">
          <Field label="Title" name="title" defaultValue={page.title} required />
          <Field label="Slug" name="slug" defaultValue={page.slug} />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
            <select name="categoryId" defaultValue={page.categoryId?.toString() ?? ""} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <option value="">No category</option>
              {categoryRows.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <Field label="Alt text" name="altText" defaultValue={page.altText} required />
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <ImageUploadField label="Coloring image" name="imageUrl" slugField="slug" kind="image" profile="coloring" defaultValue={page.imageUrl} required />
          <ImageUploadField label="SVG line art" name="svgUrl" slugField="slug" kind="svg" defaultValue={page.svgUrl} />
        </section>

        <CollectionSheetsField initial={sheets} />

        <TextArea label="Description" name="description" defaultValue={page.description} rows={5} />
        <section className="space-y-5 rounded-xl border border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Coloring page sections</h2>
            <p className="mt-1 text-sm text-slate-600">These optional sections are shown publicly when they contain content. Enter one list item per line.</p>
          </div>
          <TextArea label="Meet your coloring page" name="meetYourColoringPage" defaultValue={page.meetYourColoringPage} rows={3} />
          <TextArea label="What you'll need — one material per line" name="whatYoullNeed" defaultValue={page.whatYoullNeed?.join("\n")} rows={3} />
          <TextArea label="Fun coloring ideas — one idea per line" name="funColoringIdeas" defaultValue={page.funColoringIdeas?.join("\n")} rows={4} />
          <div className="grid gap-4 md:grid-cols-2">
            <TextArea label="Learning activity title" name="learningActivityTitle" defaultValue={page.learningActivity?.title} rows={2} />
            <TextArea label="Learning activity description" name="learningActivityDescription" defaultValue={page.learningActivity?.description} rows={3} />
            <TextArea label="Learning activity" name="learningActivityActivity" defaultValue={page.learningActivity?.activity} rows={3} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextArea label="Make it your own — description" name="makeItYourOwnDescription" defaultValue={page.makeItYourOwn?.description} rows={3} />
            <TextArea label="Make it your own — challenge" name="makeItYourOwnChallenge" defaultValue={page.makeItYourOwn?.challenge} rows={3} />
          </div>
          <TextArea label="Printing tips — one tip per line" name="printingTips" defaultValue={page.printingTips?.join("\n")} rows={4} />
        </section>
        <TextArea label="SVG content" name="svgContent" defaultValue={page.svgContent} rows={8} />

        <section className="grid gap-5 md:grid-cols-3">
          <Field label="Tags" name="tags" defaultValue={page.tags?.join(", ")} />
          <Field label="Age range" name="ageRange" defaultValue={page.ageRange} />
          <Field label="Difficulty" name="difficulty" defaultValue={page.difficulty} />
        </section>

        <SeoMetadataFields seoTitle={page.seoTitle} seoDescription={page.seoDescription} />

        <div className="flex flex-wrap gap-6">
          <Check label="Published" name="isPublished" defaultChecked={page.isPublished ?? false} />
          <Check label="Featured" name="featured" defaultChecked={page.featured ?? false} />
          <Check label="Popular" name="popular" defaultChecked={page.popular ?? false} />
        </div>

        <div className="flex items-center gap-3">
          <Submit label="Save changes" />
          <Link href="/admin/coloring-pages/" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700">Cancel</Link>
        </div>
      </form>

      <form action={remove} className="mt-6">
        <DeleteConfirmButton label="Delete this page" name={page.title} />
      </form>
    </AdminShell>
  );
}
