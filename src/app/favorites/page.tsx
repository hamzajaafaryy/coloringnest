import { Heart } from "lucide-react";
import { getAllPublishedColoringPagesWithCategory } from "@/db/queries";
import FavoritesCollection from "@/components/FavoritesCollection";
import { constructMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "My Favorite Coloring Pages",
  description: "Find the coloring pages you saved to your favorites on this device.",
  path: "/favorites/",
  noindex: true,
});

export default async function FavoritesPage() {
  const pages = await getAllPublishedColoringPagesWithCategory();
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="rounded-[2rem] border-2 border-[#2b2140] bg-[#fff3d6] px-6 py-10 shadow-[6px_6px_0_rgba(43,33,64,0.16)] sm:px-10">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#2b2140] bg-white px-3 py-1.5 text-xs font-extrabold text-[#2b2140] shadow-[3px_3px_0_#2b2140]">
          <Heart className="h-4 w-4" /> Your creative collection
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-[#2b2140]">My Favorite Coloring Pages</h1>
        <p className="mt-3 max-w-xl text-[#514461]">Keep your favorite designs handy for coloring or printing again.</p>
      </header>
      <FavoritesCollection pages={pages} />
    </main>
  );
}
