import Link from "next/link";
import { Sparkles } from "lucide-react";

// A real subscription form can return once a mailing service is configured.
export default function Newsletter() {
  return (
    <section className="my-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 text-center text-white shadow-xl sm:p-12">
      <Sparkles className="mx-auto mb-4 h-7 w-7 text-amber-300" />
      <h2 className="text-2xl font-extrabold sm:text-3xl">Find Your Next Coloring Page</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-indigo-200">
        Explore free coloring sheets for creative time at home or in the classroom.
        Choose a favorite to print, download, or color online where available.
      </p>
      <Link href="/coloring-pages/" className="cc-btn mt-6 bg-yellow-300 text-slate-950 hover:bg-yellow-200">
        Browse Free Coloring Pages
      </Link>
    </section>
  );
}
