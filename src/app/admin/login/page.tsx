"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/admin-actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function submit(formData: FormData) {
    setError("");

    startTransition(async () => {
      const result = await loginAdmin(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.replace("/admin/");
      router.refresh();
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-2xl font-black text-white shadow-lg shadow-indigo-500/20">
            C
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            CraftColoring Admin
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your content.
          </p>
        </div>

        <form
          action={submit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
        >
          <label className="block text-sm font-medium text-slate-200">
            Username
            <input
              name="username"
              type="text"
              autoComplete="username"
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
            />
          </label>

          <label className="mt-5 block text-sm font-medium text-slate-200">
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
            />
          </label>

          {error ? (
            <p className="mt-4 rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
