import { Eye, Palette, Lightbulb, BookOpen } from "lucide-react";

function descriptionParagraphs(description: string) {
  // Restore missing sentence spacing in pasted text, while preserving the wording.
  const text = description.trim().replace(/([.!?])([A-Z])/g, "$1 $2");
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  if (paragraphs.length > 1) return paragraphs;
  const sentences = Array.from(new Intl.Segmenter("en", { granularity: "sentence" }).segment(text), item => item.segment);
  const groups: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    groups.push(sentences.slice(i, i + 3).join(" ").replace(/\s+/g, " ").trim());
  }
  return groups.filter(Boolean);
}

const activities = [
  { icon: Eye, step: "01", title: "Look closely", prompt: "What do you notice first? Point to one big shape and one tiny detail.", skill: "Practice noticing", style: "border-sky-200 bg-sky-50", accent: "bg-sky-100 text-sky-800" },
  { icon: Palette, step: "02", title: "Pick your palette", prompt: "Choose three colors. Say their names, then decide where each one will go.", skill: "Learn color words", style: "border-violet-200 bg-violet-50", accent: "bg-violet-100 text-violet-800" },
  { icon: Lightbulb, step: "03", title: "Imagine a story", prompt: "What could happen in this picture? Add a background and tell someone your story.", skill: "Practice storytelling", style: "border-amber-200 bg-amber-50", accent: "bg-amber-100 text-amber-900" },
];

export default function ColoringLearningGuide({ title, description, onlineAvailable }: {
  title: string;
  description: string | null;
  onlineAvailable: boolean;
}) {
  return (
    <section className="space-y-8" aria-label="Coloring ideas and learning activities">
      {description?.trim() && (
        <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-6 sm:p-9">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-violet-800">
            <BookOpen className="h-4 w-4" aria-hidden="true" /> A little inspiration
          </span>
          <h2 className="max-w-3xl text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">About {title}</h2>
          <div className="mt-5 max-w-3xl space-y-4 text-base leading-8 text-slate-700">
            {descriptionParagraphs(description).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-violet-700">Little artist activities</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">Look, color &amp; tell a story</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">Try these three mini activities on your own or with a grown-up. Your colors, your ideas!</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {activities.map(({ icon: Icon, step, title: activityTitle, prompt, skill, style, accent }) => (
            <article key={step} className={`flex flex-col rounded-3xl border p-6 ${style}`}>
              <div className="mb-5 flex items-center justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}><Icon className="h-6 w-6" aria-hidden="true" /></span>
                <span className="text-sm font-extrabold text-slate-500">{step}</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{activityTitle}</h3>
              <p className="mb-5 mt-3 flex-1 text-base leading-7 text-slate-700">{prompt}</p>
              <span className={`self-start rounded-full px-3 py-1.5 text-xs font-bold ${accent}`}>{skill}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-slate-900">Ready to start?</h2>
        <ul className="mt-4 space-y-3 text-base leading-7 text-slate-700">
          {onlineAvailable && <li><strong className="text-violet-800">Color on screen:</strong> Choose “Color This Page Online” to open the editor.</li>}
          <li><strong className="text-sky-800">Color on paper:</strong> Choose “Print Coloring Sheet”, then get your crayons or pencils ready.</li>
          {onlineAvailable && <li><strong className="text-amber-900">Save for later:</strong> Choose “Download Printable PNG” to save a copy.</li>}
        </ul>
      </div>
    </section>
  );
}
