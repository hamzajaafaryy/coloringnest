import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Palette,
  Sparkles,
} from "lucide-react";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { logoutAdmin } from "@/lib/admin-actions";

// Admin pages depend on the request's session and must never be prerendered.
export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login/");
  }

  async function handleLogout() {
    "use server";
    await logoutAdmin();
    redirect("/admin/login/");
  }

  const navigation = [
    {
      href: "/admin/dashboard/",
      label: "Dashboard",
      icon: LayoutDashboard,
      accent: "bg-violet-100 text-violet-700",
    },
    {
      href: "/admin/coloring-pages/",
      label: "Coloring Pages",
      icon: Palette,
      accent: "bg-sky-100 text-sky-700",
    },
    {
      href: "/admin/categories/",
      label: "Categories",
      icon: FolderOpen,
      accent: "bg-amber-100 text-amber-700",
    },
    {
      href: "/admin/blog/",
      label: "Blog",
      icon: BookOpen,
      accent: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7ff] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-violet-100 bg-white/95 px-5 py-6 shadow-[8px_0_40px_rgba(99,102,241,0.06)] backdrop-blur lg:flex lg:flex-col">
        <Link href="/admin/dashboard/" className="group flex items-center gap-3 px-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-400 text-white shadow-lg shadow-violet-200 transition group-hover:rotate-3 group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-black tracking-tight text-slate-900">
              CraftColoring
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">
              Creator Studio
            </span>
          </span>
        </Link>

        <div className="mt-9 rounded-3xl bg-gradient-to-br from-violet-50 via-fuchsia-50 to-sky-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-500">
            Your workspace
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            Create joyful coloring experiences.
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-violet-500 to-sky-400" />
          </div>
        </div>

        <nav className="mt-7 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.accent} transition group-hover:scale-105`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
          >
            View live website
          </Link>
          <form action={handleLogout}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-72">
        <div className="border-b border-violet-100 bg-white/80 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard/" className="flex items-center gap-2 font-black">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              CraftColoring
            </Link>
            <form action={handleLogout}>
              <button type="submit" className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                Log out
              </button>
            </form>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {children}
      </div>
    </div>
  );
}
