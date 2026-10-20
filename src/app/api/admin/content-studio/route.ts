import { validateStudioSeo } from "@/lib/content-studio-seo";
import { loadColoringSvg } from "@/lib/coloring/loadSvg";
import { validateColoringSvg } from "@/lib/coloring/validateSvg";
import { getCategoryBySlugFromDb } from "@/db/queries";
import { canonicalCategorySlug } from "@/lib/category-catalog";
import {NextResponse} from "next/server";
import {eq,inArray,and} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {db} from "@/db";
import {categories,coloringPages,faqs} from "@/db/schema";
import {isAdminAuthenticated} from "@/lib/admin-auth";
export const dynamic="force-dynamic";
export async function GET(){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});const [drafts,cats]=await Promise.all([db.select({id:coloringPages.id,title:coloringPages.title,description:coloringPages.description,imageUrl:coloringPages.imageUrl,categoryId:coloringPages.categoryId}).from(coloringPages).where(eq(coloringPages.isPublished,false)).limit(250),db.select({id:categories.id,name:categories.name}).from(categories)]);return NextResponse.json({drafts,categories:cats});}
export async function POST(request:Request){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});try{const b=await request.json();if(b.action==="seedCategories"){const existing=await db.select({id:categories.id}).from(categories).limit(1);if(existing.length)return NextResponse.json({error:"Categories already exist. Refresh the page."},{status:409});const names=["Animal","Christmas","Adults","Dinosaur","Easter","Fantasy & Fairy Tales","Flower & Garden","Food & Sweet Treat","Halloween","Holiday & Season","Kindergarten","Mandala","Nature & Landscape","Ocean & Sea Life","Outer Space","Preschool & Toddler","Princess","Sports","Unicorn","Vehicle & Car"];await db.insert(categories).values(names.map(name=>({name,slug:canonicalCategorySlug(name)})));return NextResponse.json({created:names.length});}if(b.action==="importJson"||b.action==="validateJson")return await importSeo(b);
 if(b.action==="create"){const title=String(b.title||"").trim().slice(0,130),hint=String(b.hint||"").trim().slice(0,1500),url=String(b.imageUrl||"");const categoryId=Number(b.categoryId)||null;const storage=process.env.SUPABASE_URL;if(!title||!storage||!url.startsWith(storage.replace(/\/$/,"")+"/storage/v1/object/public/coloring-pages/"))return NextResponse.json({error:"Invalid title or image"},{status:400});if(categoryId){const cats=await db.select({id:categories.id}).from(categories).where(eq(categories.id,categoryId)).limit(1);if(!cats.length)return NextResponse.json({error:"Invalid category"},{status:400});}const slug=(title.toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,90)||"coloring-page")+"-"+crypto.randomUUID().slice(0,8);const result=await db.insert(coloringPages).values({title,slug,description:hint||"Free printable "+title.toLowerCase()+" coloring page for kids.",imageUrl:url,categoryId,isPublished:false,altText:title+" black and white printable coloring page",seoTitle:(title+" | CraftColoring").slice(0,150),seoDescription:("Download and print this free "+title.toLowerCase()+" coloring page. Enjoy creative coloring activities for kids at home and school.").slice(0,160),tags:["content-studio"],ageRange:"Kids (6-10)",difficulty:"Easy"}).returning({id:coloringPages.id});return NextResponse.json({id:result[0].id});}if(b.action==="publish"){const ids:number[]=Array.isArray(b.ids)?Array.from(new Set<number>(b.ids.map(Number).filter((n:number)=>Number.isSafeInteger(n)&&n>0))).slice(0,100):[];if(!ids.length)return NextResponse.json({error:"Select drafts"},{status:400});const found=await db.select({id:coloringPages.id,imageUrl:coloringPages.imageUrl,categoryId:coloringPages.categoryId}).from(coloringPages).where(and(inArray(coloringPages.id,ids),eq(coloringPages.isPublished,false)));if(found.length!==ids.length||found.some(x=>!x.imageUrl||!x.categoryId))return NextResponse.json({error:"Drafts missing image or category"},{status:400});await db.update(coloringPages).set({isPublished:true,publishedAt:new Date()}).where(and(inArray(coloringPages.id,ids),eq(coloringPages.isPublished,false)));revalidatePath("/");revalidatePath("/coloring-pages/");revalidatePath("/printable-coloring-pages/");revalidatePath("/sitemap.xml");return NextResponse.json({published:ids.length});}return NextResponse.json({error:"Invalid action"},{status:400});}catch(e){console.error(e);return NextResponse.json({error:"Operation failed"},{status:500});}}


async function importSeo(body: Record<string, unknown>) {
  const { seo, issues } = validateStudioSeo(body.seo);
  if (!seo || issues.length) return NextResponse.json({ error: issues.join("; "), issues }, { status: 400 });
  const duplicate = await db.select({ id: coloringPages.id }).from(coloringPages).where(eq(coloringPages.slug, seo.slug)).limit(1);
  if (duplicate.length) return NextResponse.json({ error: "This slug already exists. Change it in the JSON before uploading." }, { status: 409 });
  const existingCategory = await getCategoryBySlugFromDb(canonicalCategorySlug(seo.category));
  const categorySlug = existingCategory?.slug || canonicalCategorySlug(seo.category);
  if (body.action === "validateJson") return NextResponse.json({ ok: true, categorySlug });

  const storage = process.env.SUPABASE_URL;
  function trustedUrl(value: unknown, folder: "images" | "svg") {
    if (typeof value !== "string" || !storage) return false;
    try {
      const url = new URL(value);
      return url.origin === new URL(storage).origin &&
        url.pathname.startsWith(`/storage/v1/object/public/coloring-pages/${folder}/`) &&
        !url.search && !url.hash;
    } catch { return false; }
  }
  if (!trustedUrl(body.imageUrl, "images")) return NextResponse.json({ error: "Upload a valid printable image first." }, { status: 400 });
  let svgContent: string | null = null;
  const svgUrl = typeof body.svgUrl === "string" && body.svgUrl ? body.svgUrl : null;
  if (body.svgUrl != null && body.svgUrl !== "" && !svgUrl) return NextResponse.json({ error: "Invalid SVG URL." }, { status: 400 });
  if (svgUrl) {
    if (!trustedUrl(svgUrl, "svg")) return NextResponse.json({ error: "Upload the SVG using the SVG field." }, { status: 400 });
    try { svgContent = validateColoringSvg(await loadColoringSvg(svgUrl)); }
    catch { return NextResponse.json({ error: "Could not read a valid vector SVG. Re-upload it or remove it to publish an image-only page." }, { status: 400 }); }
  }
  const published = body.publish === true;
  const saved = await db.transaction(async tx => {
    let categoryId = existingCategory?.id;
    if (!categoryId) {
      const created = await tx.insert(categories).values({ name: seo.category, slug: categorySlug }).returning({ id: categories.id });
      categoryId = created[0].id;
    }
    const created = await tx.insert(coloringPages).values({
      title: seo.title, slug: seo.slug, description: seo.description,
      imageUrl: body.imageUrl as string, svgUrl, svgContent, categoryId,
      seoTitle: seo.seoTitle, seoDescription: seo.seoDescription, altText: seo.altText,
      tags: [...new Set([...seo.tags, seo.primaryKeyword, ...seo.keywords])].slice(0, 12),
      ageRange: seo.ageRange, difficulty: seo.difficulty,
      isPublished: published, publishedAt: published ? new Date() : null,
    }).returning({ id: coloringPages.id });
    await tx.insert(faqs).values(seo.faqs.map((faq, index) => ({ coloringPageId: created[0].id, question: faq.question, answer: faq.answer, sortOrder: index + 1 })));
    return created[0];
  });
  if (published) for (const path of ["/", "/coloring-pages/", "/printable-coloring-pages/", "/color-online/", "/sitemap.xml"]) revalidatePath(path);
  return NextResponse.json({ id: saved.id, slug: seo.slug, categorySlug, published });
}
