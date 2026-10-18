"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export const FAVORITES_KEY = "craftcoloring_favorites_v1";
export const FAVORITES_CHANGED = "craftcoloring:favorites-changed";

export function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string").slice(0, 500)
      : [];
  } catch {
    return [];
  }
}

export default function FavoriteButton({
  slug, categorySlug, title,
}: { slug: string; categorySlug: string; title: string }) {
  const id = `${categorySlug}/${slug}`;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(readFavorites().includes(id));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(FAVORITES_CHANGED, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(FAVORITES_CHANGED, sync);
    };
  }, [id]);

  const toggle = () => {
    const next = new Set(readFavorites());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next].slice(-500)));
      window.dispatchEvent(new Event(FAVORITES_CHANGED));
    } catch {
      // Browsers with blocked storage can still view coloring pages normally.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from favorites` : `Save ${title} to favorites`}
      title={saved ? "Remove from favorites" : "Save to favorites"}
      className={`absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border shadow-md transition-all hover:scale-110 focus-visible:ring-4 focus-visible:ring-pink-200 sm:right-6 sm:top-6 ${
        saved
          ? "border-pink-200 bg-pink-500 text-white"
          : "border-white bg-white/95 text-slate-500 hover:text-pink-600"
      }`}
    >
      <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} aria-hidden="true" />
    </button>
  );
}
