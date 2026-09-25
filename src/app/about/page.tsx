import Link from "next/link";
import { Palette, ShieldCheck, Heart, Sparkles, Printer } from "lucide-react";
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900">100% Free & Safe</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            No mandatory signups, paywalls, or hidden downloads. Safe for kids of all ages.
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900">Digital + Printable</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Color online in your browser with interactive tools, or print sharp black-and-white vector sheets at home.
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900">Family & Education</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Designed for early child development, fine motor practice, classroom learning, and adult mindfulness.
          </p>
        </div>
      </div>
    </div>
  );
}
