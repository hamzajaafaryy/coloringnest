import ColorQuest from "@/components/colorquest/ColorQuest";
import { constructMetadata } from "@/lib/seo";
import { BookOpen, Sparkles } from "lucide-react";

export const metadata = constructMetadata({
  title: "ColorQuest - Create Your Own Coloring Storybook",
  description:
    "Color a little dragon, explore a magical forest, choose an animal friend, and make your own personalized storybook. Free coloring adventure for kids with a printable PDF keepsake.",
  path: "/colorquest/",
});

export default function ColorQuestPage() {
  return (
    <div className="cq-page mx-auto w-full min-w-0 max-w-7xl px-4 py-7 sm:px-6 sm:py-12 lg:px-8">
      <div className="cq-page-intro mb-8 max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-black text-violet-700">
          <Sparkles className="h-4 w-4" />A coloring adventure made by you
        </span>
        <h1 className="mt-4 flex items-center gap-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          <BookOpen className="h-9 w-9 shrink-0 text-violet-600" />
          Color<span className="-ml-3 text-violet-600">Quest</span>
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Don’t just color a picture. Bring a story to life, one chapter at a
          time.
        </p>
      </div>
      <ColorQuest />
    </div>
  );
}
