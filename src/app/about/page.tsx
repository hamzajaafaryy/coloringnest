import { Palette, ShieldCheck, Heart, Sparkles } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "About CraftColoring",
  description: "Learn about CraftColoring and our mission to provide free, accessible online coloring experiences for kids, families, teachers, and adults.",
  path: "/about/",
});

export default function AboutPage() {
  const breadcrumbItems = [{ label: "About Us", href: "/about/" }];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
          <Palette className="w-3.5 h-3.5" />
          <span>Our Mission & Story</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Welcome to CraftColoring
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          CraftColoring was founded with a simple goal: to provide children, parents, teachers, and adult artists with high-quality, completely free coloring pages accessible anytime, anywhere.
        </p>
      </div>

      <section className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="text-xl font-bold text-slate-900">A small library for creative time</h2>
        <p className="leading-7 text-slate-600">CraftColoring brings coloring artwork, browser tools, and practical activity guides together. Choose a picture, explore it on screen, or use the available print and download controls.</p>
        <p className="leading-7 text-slate-600">Our guides share creative suggestions, not medical or developmental advice. There is no single correct palette, and a page does not need to be finished in one sitting.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900">Free to explore</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Browse and use the coloring tools without creating an account. Adults can help children choose suitable pictures and materials.
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900">Digital + Printable</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Color online in your browser with interactive tools, or print black-and-white coloring sheets at home.
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900">Family & Education</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Find pictures for family activities, classroom projects, or your own creative time. Age and difficulty labels are suggestions.
          </p>
        </div>
      </div>
    </div>
  );
}
