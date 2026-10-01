import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FolderOpen,
  Palette,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import {
  getAllPublishedBlogPosts,
  getAllPublishedCategories,
  getAllPublishedColoringPagesWithCategory,
} from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [categories, coloringPages, blogPosts] = await Promise.all([
    getAllPublishedCategories(),
    getAllPublishedColoringPagesWithCategory(),
    getAllPublishedBlogPosts(),
  ]);

  const stats = [
    {
      label: "Published pages",
      value: coloringPages.length,
      href: "/admin/coloring-pages/",
      icon: Palette,
      iconClass: "bg-sky-100 text-sky-700",
      glow: "from-sky-50",
    },
    {
      label: "Categories",
      value: categories.length,
      href: "/admin/categories/",
      icon: FolderOpen,
      iconClass: "bg-amber-100 text-amber-700",
      glow: "from-amber-50",
    },
    {
      label: "Published posts",
      value: blogPosts.length,
      href: "/admin/blog/",
      icon: BookOpen,
      iconClass: "bg-emerald-100 text-emerald-700",
      glow: "from-emerald-50",
    },
  ];

  const actions = [
    {
      href: "/admin/coloring-pages/",
      title: "Coloring Pages",
      text: "Create, edit, upload artwork and manage SEO.",
      icon: Palette,
      className: "bg-sky-50 text-sky-700 ring-sky-100",
    },
    {
      href: "/admin/categories/",
      title: "Categories",
      text: "Organize your library with clean category pages.",
      icon: FolderOpen,
      className: "bg-amber-50 text-amber-700 ring-amber-100",
    },
    {
      href: "/admin/blog/",
      title: "Blog",
      text: "Publish helpful articles and grow organic traffic.",
      icon: BookOpen,
      className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.14),transparent_34%),radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.10),transparent_28%),#f8f7ff]">
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-fuchsia-500 to-sky-500 p-7 text-white shadow-2xl shadow-violet-200/60 sm:p-10">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-bold text-white/85">
              <Sparkles className="h-4 w-4" />
              CraftColoring Creator Studio
            </div>
            <h1 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              Bring every coloring page to life.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
              Manage your coloring library, categories, blog and SEO from one joyful workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/admin/coloring-pages/new/"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <WandSparkles className="h-4 w-4" />
                Create coloring page
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/20"
              >
                View website
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className={`group relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br ${stat.glow} to-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="flex items-start justify-between">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500" />
                </div>
                <p className="mt-6 text-sm font-semibold text-slate-500">{stat.label}</p>
                <p className="mt-1 text-4xl font-black tracking-tight text-slate-900">{stat.value}</p>
              </Link>
            );
          })}
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">Workspace</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Quick actions</h2>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
                >
                  <span className={`inline-flex rounded-2xl p-3 ring-1 ${action.className}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <h3 className="font-extrabold text-slate-900">{action.title}</h3>
                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{action.text}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-extrabold text-slate-900">Admin setup</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Keep ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_SESSION_SECRET configured in your deployment environment.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              Secure workspace
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
