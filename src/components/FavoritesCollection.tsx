"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Shuffle } from "lucide-react";
import ColoringGrid from "@/components/ColoringGrid";
import { readFavorites, FAVORITES_CHANGED } from "@/components/FavoriteButton";
import type { DbColoringPageCard } from "@/types/coloring";

export default function FavoritesCollection({ pages }: { pages: DbColoringPageCard[] }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIds(readFavorites());
      setReady(true);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(FAVORITES_CHANGED, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(FAVORITES_CHANGED, sync);
    };
  }, []);

  const selected = new Set(ids);
  const favorites = pages.filter(
    (page) => page.slug && page.categorySlug && selected.has(`${page.categorySlug}/${page.slug}`)
  );

  if (!ready) {
    return <div className="rounded-3xl border-2 border-[#2b2140] bg-white p-12 text-center text-[#625973] shadow-[5px_5px_0_rgba(43,33,64,0.14)]" role="status">Loading your saved pages…</div>;
  }

  if (!favorites.length) {
    return (
      <div className="rounded-[2rem] border-2 border-[#2b2140] bg-[#fff3d6] px-6 py-14 text-center shadow-[6px_6px_0_rgba(43,33,64,0.16)]">
        <Heart className="mx-auto h-12 w-12 text-[#ff5d73]" aria-hidden="true" />
        <h2 className="mt-5 text-2xl font-black text-[#2b2140]">Your favorite pages will appear here</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#514461]">Tap the heart on a coloring page to save it on this device, with no account needed.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/coloring-pages/" className="cc-btn cc-btn-primary">Explore coloring pages</Link>
          <Link href="/surprise-me/" className="cc-btn cc-btn-outline"><Shuffle className="h-4 w-4" /> Surprise me</Link>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="Saved coloring pages" className="space-y-5">
      <p className="text-sm font-semibold text-[#514461]">{favorites.length} saved coloring {favorites.length === 1 ? "page" : "pages"} on this device</p>
      <ColoringGrid pages={favorites} />
      <p className="text-xs text-[#625973]">Favorites are stored only in this browser. They will not sync between devices.</p>
    </section>
  );
}
