import Link from "next/link";

import {
  getAllPublishedCategories,
} from "@/db/queries";

export default async function NotFound() {
  const categories =
    await getAllPublishedCategories();

  const featuredCategories =
    categories
      .filter(
        (category) =>
          category.featured ||
          category.popular
      )
      .slice(0, 4);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-3xl w-full text-center">

        {/* =================================================
            404
        ================================================= */}

        <div className="space-y-4">

          <p className="text-7xl sm:text-8xl font-black text-indigo-600">
            404
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Oops! Coloring Page Not Found
          </h1>

          <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
            Sorry, we couldn&apos;t find the page
            you&apos;re looking for. Explore one of
            our coloring categories below or
            browse all coloring pages.
          </p>

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">

          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </Link>

          <Link
            href="/coloring-pages/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
          >
            Browse Coloring Pages
          </Link>

        </div>

        {/* =================================================
            POPULAR CATEGORIES
        ================================================= */}

        {featuredCategories.length > 0 && (
          <section className="mt-14">

            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Explore Popular Categories
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

              {featuredCategories.map(
                (category) => (
                  <Link
                    key={category.id}
                    href={`/coloring-pages/${category.slug}/`}
                    className="group p-5 rounded-2xl border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                  >

                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600">
                      {category.name.replace(
                        "Coloring Pages",
                        ""
                      )}
                    </h3>

                    <span className="mt-2 block text-xs text-slate-500">
                      Explore →
                    </span>

                  </Link>
                )
              )}

            </div>

          </section>
        )}

      </div>
    </main>
  );
}