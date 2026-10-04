"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Download,
  LoaderCircle,
  LockKeyhole,
  Printer,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import QuestPainter from "./QuestPainter";
import { artwork } from "@/lib/colorquest/artwork";
import { downloadBook } from "@/lib/colorquest/export-book";
import {
  CHAPTERS,
  FRIENDS,
  STORAGE_KEY,
  narration,
  newQuest,
  readQuest,
  type Quest,
} from "@/lib/colorquest/story";

export default function ColorQuest() {
  const [quest, setQuest] = useState<Quest>(newQuest);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [restart, setRestart] = useState(false);
  const chapterTitle = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    let draft: Quest | null = null;
    try {
      draft = readQuest(localStorage.getItem(STORAGE_KEY));
    } catch {
      /* Private browsers can disable storage. */
    }
    // Hydrate the browser-only draft after the server and client first render match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (draft) setQuest(draft);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const save = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quest));
        setSaved(true);
      } catch {
        setSaved(false);
      }
    };
    const timer = window.setTimeout(save, 150);
    window.addEventListener("pagehide", save);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", save);
    };
  }, [quest, ready]);

  useEffect(() => {
    if (!ready || !quest.started) return;
    chapterTitle.current?.focus({ preventScroll: true });
    chapterTitle.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [quest.step, quest.started, ready]);

  async function exportPdf() {
    if (exporting) return;
    setExporting(true);
    setExportError("");
    try {
      await downloadBook(quest);
    } catch (error) {
      setExportError(
        error instanceof Error
          ? error.message
          : "Could not download the book. You can still use Print / Save as PDF.",
      );
    } finally {
      setExporting(false);
    }
  }
  const allDone = quest.completed.every(Boolean);
  const dragon = quest.dragon.trim() || "Sunny";
  const artist = quest.artist.trim() || "Young Artist";
  const unlocked = quest.completed.findIndex((done) => !done);
  const lastUnlocked = unlocked === -1 ? 3 : unlocked;

  if (!ready)
    return (
      <div
        className="py-16 text-center text-sm font-bold text-violet-600"
        role="status"
      >
        <LoaderCircle className="mx-auto mb-3 h-7 w-7 animate-spin" />
        Getting your adventure ready…
      </div>
    );

  return (
    <div className="cq-shell min-w-0">
      {!quest.started ? (
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)]">
          <section className="rounded-[2rem] border border-violet-100 bg-white p-5 shadow-xl shadow-violet-100/40 sm:p-8">
            <span className="text-xs font-black uppercase tracking-widest text-violet-600">
              Your story starts here
            </span>
            <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
              A tiny dragon. A missing rainbow. You!
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Meet a dragon, explore the woods, make a friend, and wake up a
              rainbow. Your colors bring every chapter to life.
            </p>
            <form
              className="mt-6 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                setQuest((q) => ({
                  ...q,
                  artist: artist,
                  dragon: dragon,
                  started: true,
                }));
              }}
            >
              <label className="block text-sm font-black text-slate-700">
                Your first name{" "}
                <span className="font-normal text-slate-400">(optional)</span>
                <input
                  value={quest.artist}
                  onChange={(event) =>
                    setQuest((q) => ({ ...q, artist: event.target.value }))
                  }
                  maxLength={32}
                  autoComplete="off"
                  placeholder="Young Artist"
                  className="cq-input mt-2"
                />
              </label>
              <label className="block text-sm font-black text-slate-700">
                Name your dragon
                <input
                  value={quest.dragon}
                  onChange={(event) =>
                    setQuest((q) => ({ ...q, dragon: event.target.value }))
                  }
                  maxLength={32}
                  autoComplete="off"
                  placeholder="Sunny"
                  className="cq-input mt-2"
                />
              </label>
              <fieldset>
                <legend className="mb-2 text-sm font-black text-slate-700">
                  Who will join your adventure?
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {FRIENDS.map((friend) => (
                    <label
                      key={friend.id}
                      className={`relative flex min-w-0 cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center ${quest.friend === friend.id ? "border-violet-500 bg-violet-50" : "border-slate-100 bg-white"}`}
                    >
                      <input
                        type="radio"
                        name="friend"
                        value={friend.id}
                        checked={quest.friend === friend.id}
                        onChange={() =>
                          setQuest((q) => ({ ...q, friend: friend.id }))
                        }
                        className="sr-only peer"
                      />
                      <span className="text-3xl" aria-hidden="true">
                        {friend.emoji}
                      </span>
                      <span className="text-xs font-bold text-slate-700 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-violet-500">
                        {friend.name}
                      </span>
                      {quest.friend === friend.id && (
                        <Check className="h-4 w-4 text-violet-600" />
                      )}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button type="submit" className="cc-btn cc-btn-primary w-full">
                Let’s start the adventure
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </section>
          <aside className="self-start rounded-[2rem] border border-amber-100 bg-[#fffaf3] p-5 sm:p-8">
            <div
              className="cq-art overflow-hidden rounded-2xl bg-white"
              dangerouslySetInnerHTML={{
                __html: artwork(0, "rabbit", {
                  "dragon-body": "#a78bfa",
                  "dragon-head": "#a78bfa",
                  "dragon-belly": "#fde68a",
                  "dragon-wing": "#f9a8d4",
                  "dragon-cheek": "#f9a8d4",
                }),
              }}
            />
            <h3 className="mt-4 text-xl font-black text-slate-950">
              Make a book that is truly yours.
            </h3>
            <ul className="mt-4 space-y-3 text-sm font-bold text-slate-600">
              <li>🎨 Four original pictures to color</li>
              <li>🐾 A friend of your choice</li>
              <li>📖 A story with your name and colors</li>
              <li>🖨️ A keepsake to download or print</li>
            </ul>
            <p className="mt-5 text-xs leading-6 text-slate-500">
              No account needed. Your adventure saves on this browser when
              storage is available.
            </p>
          </aside>
        </div>
      ) : (
        <>
          <div className="cq-controls mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="cc-safe-wrap text-sm font-bold text-slate-600">
              <span className="text-violet-700">{artist}’s adventure</span> ·{" "}
              {quest.completed.filter(Boolean).length} / 4 chapters
            </p>
            <p className="text-xs text-slate-500" aria-live="polite">
              {saved
                ? "Progress saved on this browser"
                : "Browser storage unavailable — keep this tab open"}
            </p>
          </div>
          <nav
            className="cq-controls mb-6 grid grid-cols-4 gap-2"
            aria-label="Story chapters"
          >
            {CHAPTERS.map((chapter, index) => (
              <button
                type="button"
                key={chapter.short}
                disabled={index > lastUnlocked}
                onClick={() => setQuest((q) => ({ ...q, step: index }))}
                aria-current={quest.step === index ? "step" : undefined}
                className={`flex min-w-0 flex-col items-center gap-2 rounded-2xl border p-2 text-center sm:flex-row sm:justify-center sm:p-3 ${quest.step === index ? "border-violet-400 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-500"} disabled:opacity-45`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black">
                  {quest.completed[index] ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : index > lastUnlocked ? (
                    <LockKeyhole className="h-3.5 w-3.5" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="text-[11px] font-black sm:text-sm">
                  {chapter.short}
                </span>
              </button>
            ))}
          </nav>
          {quest.step < 4 ? (
            <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <div>
                <div className="mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-violet-600">
                    Chapter {quest.step + 1} of 4
                  </span>
                  <h2
                    ref={chapterTitle}
                    tabIndex={-1}
                    className="mt-2 scroll-mt-28 text-2xl font-black text-slate-950 outline-none sm:text-3xl"
                  >
                    {CHAPTERS[quest.step].title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {CHAPTERS[quest.step].hint}
                  </p>
                </div>
                <QuestPainter
                  key={quest.step}
                  chapter={quest.step}
                  friend={quest.friend}
                  initialPaint={quest.paintings[quest.step]}
                  onChange={(paint) =>
                    setQuest((q) => ({
                      ...q,
                      paintings: q.paintings.map((old, i) =>
                        i === q.step ? paint : old,
                      ),
                      completed: q.completed.map((done, i) =>
                        i === q.step && !Object.keys(paint).length
                          ? false
                          : done,
                      ),
                    }))
                  }
                  onComplete={() =>
                    setQuest((q) => ({
                      ...q,
                      completed: q.completed.map((done, i) =>
                        i === q.step ? true : done,
                      ),
                      step: q.step + 1,
                    }))
                  }
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {quest.step > 0 && (
                    <button
                      type="button"
                      className="cc-btn cc-btn-soft"
                      onClick={() =>
                        setQuest((q) => ({ ...q, step: q.step - 1 }))
                      }
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous chapter
                    </button>
                  )}
                  {allDone && (
                    <button
                      type="button"
                      className="cc-btn cc-btn-soft"
                      onClick={() => setQuest((q) => ({ ...q, step: 4 }))}
                    >
                      <BookOpen className="h-4 w-4" />
                      View my book
                    </button>
                  )}
                </div>
              </div>
              <aside className="rounded-[2rem] border border-amber-100 bg-[#fffaf3] p-5 sm:p-7">
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-600">
                  <BookOpen className="h-4 w-4" />
                  The story so far
                </span>
                <h3 className="cc-safe-wrap mt-4 text-xl font-black text-slate-950">
                  {dragon} and the Lost Rainbow
                </h3>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {narration(quest, quest.step)}
                </p>
                <div className="mt-6 rounded-2xl bg-white p-4 text-sm font-bold leading-6 text-violet-700">
                  <Sparkles className="mb-2 h-5 w-5 text-fuchsia-500" />
                  Your dragon’s body color changes where the story begins. Try
                  blue, green, or a warm color!
                </div>
              </aside>
            </div>
          ) : (
            <>
              <section className="cq-controls mb-6 rounded-[2rem] border border-violet-200 bg-violet-50 p-5 text-center sm:p-8">
                <Sparkles className="mx-auto h-9 w-9 text-fuchsia-500" />
                <h2
                  ref={chapterTitle}
                  tabIndex={-1}
                  className="mt-3 scroll-mt-28 text-3xl font-black text-slate-950 outline-none"
                >
                  You made a storybook!
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Every color is yours. Keep your adventure, share it with
                  family, or print it for your bookshelf.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    disabled={exporting}
                    onClick={exportPdf}
                    className="cc-btn cc-btn-primary disabled:opacity-60"
                  >
                    {exporting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {exporting ? "Making your book…" : "Download storybook PDF"}
                  </button>
                  <button
                    type="button"
                    className="cc-btn cc-btn-outline"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4" />
                    Print / Save as PDF
                  </button>
                </div>
                {exportError && (
                  <p className="mt-4 text-sm text-red-700" role="alert">
                    {exportError}
                  </p>
                )}
              </section>
              <div className="cq-book mx-auto max-w-3xl space-y-5">
                <article className="cq-book-page rounded-[2rem] border border-violet-100 bg-white p-5 text-center shadow-lg sm:p-9">
                  <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                    CraftColoring · ColorQuest
                  </p>
                  <h2 className="cc-safe-wrap mt-5 text-3xl font-black text-slate-950 sm:text-4xl">
                    {dragon} and the Lost Rainbow
                  </h2>
                  <p className="cc-safe-wrap mt-4 font-bold text-slate-600">
                    Colored and created by {artist}
                  </p>
                  <div
                    className="cq-art mt-6"
                    dangerouslySetInnerHTML={{
                      __html: artwork(0, quest.friend, quest.paintings[0]),
                    }}
                  />
                  <p className="mt-4 text-sm font-bold text-violet-600">
                    Four little chapters. One big imagination.
                  </p>
                </article>
                {CHAPTERS.map((chapter, index) => (
                  <article
                    key={chapter.short}
                    className="cq-book-page rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg sm:p-9"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                      Chapter {index + 1} of 4
                    </p>
                    <h2 className="mt-3 text-2xl font-black text-slate-950">
                      {chapter.title}
                    </h2>
                    <div
                      className="cq-art my-5"
                      dangerouslySetInnerHTML={{
                        __html: artwork(
                          index,
                          quest.friend,
                          quest.paintings[index],
                        ),
                      }}
                    />
                    <p className="cc-safe-wrap text-base leading-8 text-slate-600">
                      {narration(quest, index)}
                    </p>
                    <p className="mt-5 text-xs text-slate-400">
                      CraftColoring.com
                    </p>
                  </article>
                ))}
              </div>
            </>
          )}
          <div className="cq-controls mt-8 border-t border-slate-100 pt-5">
            {restart ? (
              <div
                className="rounded-2xl border border-orange-200 bg-orange-50 p-4"
                role="alert"
              >
                <p className="text-sm font-bold text-slate-700">
                  Start fresh? This replaces your saved adventure. Download your
                  finished book first if you want to keep it.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="cc-btn cc-btn-print"
                    onClick={() => {
                      setQuest(newQuest());
                      setRestart(false);
                      setExportError("");
                    }}
                  >
                    Start fresh
                  </button>
                  <button
                    type="button"
                    className="cc-btn cc-btn-outline"
                    onClick={() => setRestart(false)}
                  >
                    Keep my adventure
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="cc-btn cc-btn-outline text-xs"
                onClick={() => setRestart(true)}
              >
                <RotateCcw className="h-4 w-4" />
                Start a new adventure
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
