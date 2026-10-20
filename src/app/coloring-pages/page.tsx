import Link from "next/link";
import ColoringGrid from "@/components/ColoringGrid";
import {getAllPublishedColoringPagesWithCategory,getAllPublishedCategories} from "@/db/queries";
import {constructMetadata} from "@/lib/seo";
export const dynamic="force-dynamic";
export const metadata=constructMetadata({title:"Free Coloring Pages for Kids",description:"Browse printable coloring pages for kids. Choose a picture, grab your crayons, and enjoy a simple coloring activity.",path:"/coloring-pages/"});
export default async function ColoringPages(){const [pages,categories]=await Promise.all([getAllPublishedColoringPagesWithCategory(),getAllPublishedCategories()]);
return <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6"><header><h1 className="text-4xl font-black">Free coloring pages</h1><p className="mt-3 max-w-2xl text-slate-600">Find a picture that makes you smile. Open it to see the details, print it, or try coloring online when that option is available.</p></header>
{categories.length>0&&<nav aria-label="Coloring categories" className="flex flex-wrap gap-2">{categories.map(c=><Link key={c.id} href={`/coloring-pages/${c.slug}/`} className="rounded-full border border-violet-200 px-4 py-2 text-sm font-bold text-violet-700">{c.name}</Link>)}</nav>}
{pages.length?<ColoringGrid pages={pages}/>:<p className="rounded-2xl border border-dashed p-10 text-slate-600">There are no coloring pages here yet. We are getting the collection ready.</p>}</main>}