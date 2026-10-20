import Link from "next/link";
import ColoringGrid from "@/components/ColoringGrid";
import {getAllPublishedColoringPagesWithCategory,getAllPublishedCategories} from "@/db/queries";
import {constructMetadata} from "@/lib/seo";
export const dynamic="force-dynamic";
export const metadata=constructMetadata({title:"Free Coloring Pages to Print and Color",description:"Find free coloring pages for kids. Pick a picture, print it at home, or choose a design to color online.",path:"/"});
export default async function Home(){
 const [pages,categories]=await Promise.all([getAllPublishedColoringPagesWithCategory(),getAllPublishedCategories()]);
 return <main className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6">
 <section className="rounded-[2rem] bg-gradient-to-br from-violet-100 via-white to-amber-100 p-8 sm:p-14">
 <span className="text-sm font-bold text-violet-700">Welcome to CraftColoring</span>
 <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">Pick a picture. Make it colorful.</h1>
 <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">Looking for something fun to color? Browse our free coloring pages, find a favorite, and print it for your next art time. New pictures will be added as we go.</p>
 <div className="mt-7 flex flex-wrap gap-3"><Link href="/coloring-pages/" className="rounded-xl bg-violet-700 px-6 py-3 font-bold text-white">Browse coloring pages</Link><Link href="/printable-coloring-pages/" className="rounded-xl border border-violet-200 bg-white px-6 py-3 font-bold text-violet-800">Find printables</Link></div>
 </section>
 <section><h2 className="text-2xl font-black">Latest coloring pages</h2><p className="mt-2 text-slate-600">Fresh pictures for crayons, colored pencils, or a quiet afternoon at home.</p>
 <div className="mt-6">{pages.length?<ColoringGrid pages={pages.slice(0,12)}/>:<p className="rounded-2xl border border-dashed p-8 text-slate-600">Our first coloring pages are on the way. Come back soon to see what is new.</p>}</div></section>
 {categories.length>0&&<section><h2 className="text-2xl font-black">Find a favorite theme</h2><div className="mt-5 flex flex-wrap gap-3">{categories.map(c=><Link key={c.id} href={`/coloring-pages/${c.slug}/`} className="rounded-full border bg-white px-5 py-3 font-semibold text-violet-700 hover:bg-violet-50">{c.name}</Link>)}</div></section>}
 <section className="rounded-2xl bg-sky-50 p-7"><h2 className="text-xl font-black">A little coloring break</h2><p className="mt-2 max-w-2xl text-slate-700">You do not need fancy supplies to have fun. A printed page and a few crayons are a lovely place to start. Parents and teachers can explore the library for simple activities to share with children.</p></section>
 </main>;
}