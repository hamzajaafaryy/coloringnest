import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllPublishedCategories, getAllPublishedColoringPagesWithCategory, getAllPublishedBlogPosts } from "@/db/queries";
import { logoutAdmin } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [categories, coloringPages, blogPosts] = await Promise.all([
    getAllPublishedCategories(),
    getAllPublishedColoringPagesWithCategory(),
    getAllPublishedBlogPosts(),
  ]);

  async function handleLogout() {
    "use server";
    await logoutAdmin();
    redirect("/admin/login/");
  }

  const stats = [
    { label: "Published pages", value: coloringPages.length, href: "/admin/coloring-pages/" },
    { label: "Categories", value: categories.length, href: "/admin/categories/" },
    { label: "Published posts", value: blogPosts.length, href: "/admin/blog/" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-indigo-600">CraftColoring</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              View site
            </Link>
            <form action={handleLogout}>
              <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-2 text-4xl font-bold text-slate-900">{stat.value}</p>
            </Link>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">Quick actions</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Link href="/admin/coloring-pages/" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300">
              <p className="font-semibold text-slate-900">Coloring Pages</p>
              <p className="mt-1 text-sm text-slate-500">Manage pages, images, SVG and SEO.</p>
            </Link>
            <Link href="/admin/categories/" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300">
              <p className="font-semibold text-slate-900">Categories</p>
              <p className="mt-1 text-sm text-slate-500">Manage categories and category SEO.</p>
            </Link>
            <Link href="/admin/blog/" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300">
              <p className="font-semibold text-slate-900">Blog</p>
              <p className="mt-1 text-sm text-slate-500">Manage articles and publication status.</p>
            </Link>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-950">Admin setup</h2>
          <p className="mt-1 text-sm leading-6 text-amber-900">
            Before using this panel in production, configure ADMIN_USERNAME,
            ADMIN_PASSWORD and ADMIN_SESSION_SECRET in your deployment environment.
          </p>
        </section>
      </div>
    </main>
  );
}
