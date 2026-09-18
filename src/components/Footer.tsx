import Link from "next/link";

import { getAllPublishedCategories } from "@/db/queries";

export default async function Footer() {
  const categories =
    await getAllPublishedCategories();

  const topCategories = categories
    .filter(
      (category) =>
        category.featured ||
        category.popular
    )
    .slice(0, 8);

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="space-y-4">

            <Link
              href="/"
              className="inline-flex items-center"
            >
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                ColoringNest
              </span>
            </Link>

            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
              Free online coloring pages for
              kids and adults. Color directly
              in your browser or print your
              favorite designs.
            </p>

          </div>

          {/* =================================================
              POPULAR CATEGORIES
          ================================================= */}

          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Popular Categories
            </h2>

            <ul className="space-y-2">

              {topCategories.map(
                (category) => (
                  <li key={category.id}>

                    <Link
                      href={`/coloring-pages/${category.slug}/`}
                      className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      {category.name}
                    </Link>

                  </li>
                )
              )}

              <li>
                <Link
                  href="/coloring-pages/"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Explore all categories →
                </Link>
              </li>

            </ul>
          </div>

          {/* =================================================
              RESOURCES
          ================================================= */}

          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Resources
            </h2>

            <ul className="space-y-2">

              <li>
                <Link
                  href="/coloring-pages/"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Coloring Pages
                </Link>
              </li>

              <li>
                <Link
                  href="/color-online/"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Color Online
                </Link>
              </li>

              <li>
                <Link
                  href="/printable-coloring-pages/"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Printable Coloring Pages
                </Link>
              </li>

              <li>
                <Link
                  href="/blog/"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Blog
                </Link>
              </li>

            </ul>
          </div>

          {/* =================================================
              COMPANY
          ================================================= */}

          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Information
            </h2>

            <ul className="space-y-2">

              <li>
                <Link
                  href="/about/"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact/"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy-policy/"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms/"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>

            </ul>
          </div>

        </div>

        {/* ===================================================
            BOTTOM
        =================================================== */}

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()}{" "}
            ColoringNest. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Free Online Coloring Pages
          </p>

        </div>

      </div>
    </footer>
  );
}