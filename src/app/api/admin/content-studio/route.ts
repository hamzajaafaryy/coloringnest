import {NextResponse} from "next/server";
import {eq,inArray,and} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {db} from "@/db";
import {categories,coloringPages,faqs} from "@/db/schema";
import {isAdminAuthenticated} from "@/lib/admin-auth";
export const dynamic="force-dynamic";
export async function GET(){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});const [drafts,cats]=await Promise.all([db.select({id:coloringPages.id,title:coloringPages.title,description:coloringPages.description,imageUrl:coloringPages.imageUrl,categoryId:coloringPages.categoryId}).from(coloringPages).where(eq(coloringPages.isPublished,false)).limit(250),db.select({id:categories.id,name:categories.name}).from(categories)]);return NextResponse.json({drafts,categories:cats});}
export async function POST(request:Request){if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});try{const b=await request.json();if(b.action==="seedCategories"){const existing=await db.select({id:categories.id}).from(categories).limit(1);if(existing.length)return NextResponse.json({error:"Categories already exist. Refresh the page."},{status:409});const names=["Animal","Christmas","Adults","Dinosaur","Easter","Fantasy & Fairy Tales","Flower & Garden","Food & Sweet Treat","Halloween","Holiday & Season","Kindergarten","Mandala","Nature & Landscape","Ocean & Sea Life","Outer Space","Preschool & Toddler","Princess","Sports","Unicorn","Vehicle & Car"];await db.insert(categories).values(names.map(name=>({name,slug:name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")})));return NextResponse.json({created:names.length});}if(b.action==="importJson"){
 const x=b.seo;
 if(!x||typeof x!=="object"||Array.isArray(x))return NextResponse.json({error:"Invalid JSON object"},{status:400});
 const str=(key:string)=>typeof x[key]==="string"?x[key].trim():"";
 const chars=(key:string,min:number,max:number)=>str(key).length>=min&&str(key).length<=max;
 const words=(v:string)=>v.trim().split(/\s+/).filter(Boolean).length;
 const exact=(v:unknown,min:number,max:number)=>Array.isArray(v)&&v.length>=min&&v.length<=max&&v.every(w=>typeof w==="string"&&w.trim().length>0&&w.trim().length<=100);
 const err:string[]=[];
 for(const [k,low,high] of [["title",35,75],["slug",15,85],["seoTitle",45,60],["seoDescription",140,160],["altText",70,125],["cardDescription",100,155]] as [string,number,number][])if(!chars(k,low,high))err.push(k+" must have "+low+"-"+high+" characters");
 if(words(str("description"))<250||words(str("description"))>350)err.push("description must have 250-350 words");
 if(words(str("primaryKeyword"))<3||words(str("primaryKeyword"))>7)err.push("primaryKeyword must have 3-7 words");
 if(!exact(x.keywords,4,6))err.push("keywords must have 4-6 strings");
 if(!exact(x.tags,4,6))err.push("tags must have 4-6 strings");
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(str("slug")))err.push("slug must be lowercase hyphenated words");
 if(!str("seoTitle").endsWith("| CraftColoring"))err.push("seoTitle must end with | CraftColoring");
 if(!str("title").toLowerCase().endsWith("coloring page"))err.push("title must end with Coloring Page");
 if(!str("ageRange")||str("ageRange").length>50)err.push("ageRange is required (max 50 characters)");
 if(!["Easy","Medium","Hard"].includes(str("difficulty")))err.push("difficulty must be Easy, Medium or Hard");
 if(!Array.isArray(x.faqs)||x.faqs.length!==3||x.faqs.some((f:unknown)=>{if(!f||typeof f!=="object")return true;const o=f as {question?:unknown;answer?:unknown};return typeof o.question!=="string"||!o.question.trim()||typeof o.answer!=="string"||words(o.answer)<35||words(o.answer)>70;}))err.push("faqs must contain 3 questions with 35-70 word answers");
 const category=str("category");const allowed=["Animal","Christmas","Adults","Dinosaur","Easter","Fantasy & Fairy Tales","Flower & Garden","Food & Sweet Treat","Halloween","Holiday & Season","Kindergarten","Mandala","Nature & Landscape","Ocean & Sea Life","Outer Space","Preschool & Toddler","Princess","Sports","Unicorn","Vehicle & Car"];
 if(!allowed.includes(category))err.push("category must match an approved category");
 const imageUrl=String(b.imageUrl||"");const storage=process.env.SUPABASE_URL?.replace(/\/$/,"");
 if(!storage||!imageUrl.startsWith(storage+"/storage/v1/object/public/coloring-pages/"))err.push("Upload a valid image first");
 if(err.length)return NextResponse.json({error:err.join("; "),issues:err},{status:400});
 let matching=await db.select({id:categories.id}).from(categories).where(eq(categories.name,category)).limit(1);
 if(!matching.length){matching=await db.insert(categories).values({name:category,slug:category.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}).returning({id:categories.id});}
 const chosenSlug=str("slug");
 const other=await db.select({id:coloringPages.id}).from(coloringPages).where(eq(coloringPages.slug,chosenSlug)).limit(1);
 if(other.length)return NextResponse.json({error:"This slug already exists. Change it in the JSON."},{status:409});
 const published=b.publish===true;
 const tags=Array.from(new Set([...(x.tags as string[]),str("primaryKeyword"),...(x.keywords as string[])].map(v=>v.trim()))).slice(0,12);
 const saved=await db.transaction(async tx=>{
  const created=await tx.insert(coloringPages).values({title:str("title"),slug:chosenSlug,description:str("description"),imageUrl,categoryId:matching[0].id,seoTitle:str("seoTitle"),seoDescription:str("seoDescription"),altText:str("altText"),tags,ageRange:str("ageRange"),difficulty:str("difficulty"),isPublished:published,publishedAt:published?new Date():null}).returning({id:coloringPages.id});
  await tx.insert(faqs).values((x.faqs as {question:string;answer:string}[]).map((f,i)=>({coloringPageId:created[0].id,question:f.question.trim(),answer:f.answer.trim(),sortOrder:i+1})));
  return created[0];
 });
 if(published)for(const path of ["/","/coloring-pages/","/printable-coloring-pages/","/sitemap.xml"])revalidatePath(path);
 return NextResponse.json({id:saved.id,published,warning:"Cards use the SEO meta description. cardDescription is validated but not stored independently; keyword phrases are included with tags."});
 }if(b.action==="create"){const title=String(b.title||"").trim().slice(0,130),hint=String(b.hint||"").trim().slice(0,1500),url=String(b.imageUrl||"");const categoryId=Number(b.categoryId)||null;const storage=process.env.SUPABASE_URL;if(!title||!storage||!url.startsWith(storage.replace(/\/$/,"")+"/storage/v1/object/public/coloring-pages/"))return NextResponse.json({error:"Invalid title or image"},{status:400});if(categoryId){const cats=await db.select({id:categories.id}).from(categories).where(eq(categories.id,categoryId)).limit(1);if(!cats.length)return NextResponse.json({error:"Invalid category"},{status:400});}const slug=(title.toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,90)||"coloring-page")+"-"+crypto.randomUUID().slice(0,8);const result=await db.insert(coloringPages).values({title,slug,description:hint||"Free printable "+title.toLowerCase()+" coloring page for kids.",imageUrl:url,categoryId,isPublished:false,altText:title+" black and white printable coloring page",seoTitle:(title+" | CraftColoring").slice(0,150),seoDescription:("Download and print this free "+title.toLowerCase()+" coloring page. Enjoy creative coloring activities for kids at home and school.").slice(0,160),tags:["content-studio"],ageRange:"Kids (6-10)",difficulty:"Easy"}).returning({id:coloringPages.id});return NextResponse.json({id:result[0].id});}if(b.action==="publish"){const ids:number[]=Array.isArray(b.ids)?Array.from(new Set<number>(b.ids.map(Number).filter((n:number)=>Number.isSafeInteger(n)&&n>0))).slice(0,100):[];if(!ids.length)return NextResponse.json({error:"Select drafts"},{status:400});const found=await db.select({id:coloringPages.id,imageUrl:coloringPages.imageUrl,categoryId:coloringPages.categoryId}).from(coloringPages).where(and(inArray(coloringPages.id,ids),eq(coloringPages.isPublished,false)));if(found.length!==ids.length||found.some(x=>!x.imageUrl||!x.categoryId))return NextResponse.json({error:"Drafts missing image or category"},{status:400});await db.update(coloringPages).set({isPublished:true,publishedAt:new Date()}).where(and(inArray(coloringPages.id,ids),eq(coloringPages.isPublished,false)));revalidatePath("/");revalidatePath("/coloring-pages/");revalidatePath("/printable-coloring-pages/");revalidatePath("/sitemap.xml");return NextResponse.json({published:ids.length});}return NextResponse.json({error:"Invalid action"},{status:400});}catch(e){console.error(e);return NextResponse.json({error:"Operation failed"},{status:500});}}
