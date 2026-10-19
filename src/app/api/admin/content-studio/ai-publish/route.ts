import {NextResponse} from "next/server";
import {and,eq,inArray} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {db} from "@/db";
import {categories,coloringPages,faqs} from "@/db/schema";
import {isAdminAuthenticated} from "@/lib/admin-auth";
export const dynamic="force-dynamic";
export const maxDuration=60;
type Seo={title:string;description:string;seoTitle:string;seoDescription:string;altText:string;tags:string[];ageRange:string;difficulty:string;categoryId:number;faqs:{question:string;answer:string}[]};
const schema={type:"object",additionalProperties:false,required:["title","description","seoTitle","seoDescription","altText","tags","ageRange","difficulty","categoryId","faqs"],properties:{title:{type:"string"},description:{type:"string"},seoTitle:{type:"string"},seoDescription:{type:"string"},altText:{type:"string"},tags:{type:"array",items:{type:"string"}},ageRange:{type:"string"},difficulty:{type:"string"},categoryId:{type:"integer"},faqs:{type:"array",items:{type:"object",additionalProperties:false,required:["question","answer"],properties:{question:{type:"string"},answer:{type:"string"}}}}}};
async function generate(imageUrl:string,title:string,hint:string,cats:{id:number;name:string}[]):Promise<Seo>{
 const key=process.env.OPENAI_API_KEY;if(!key)throw Error("OPENAI_API_KEY is not configured");
 const storage=process.env.SUPABASE_URL?.replace(/\/$/,"");
 if(!storage||!imageUrl.startsWith(storage+"/storage/v1/object/public/coloring-pages/"))throw Error("Image is not hosted in trusted storage");
 const response=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_SEO_MODEL||"gpt-4.1-mini",temperature:0.4,response_format:{type:"json_schema",json_schema:{name:"coloring_page_seo",strict:true,schema}},messages:[{role:"system",content:"You are an expert English SEO editor for a family-friendly free printable coloring page website CraftColoring. Look carefully at the actual image. Do not invent elements not visible. Produce a unique descriptive title ending in 'Coloring Page' (under 80 characters), a natural 200-300 word description using 3 short paragraphs, seoTitle under 65 characters including ' | CraftColoring', meta seoDescription 140-160 characters, a precise accessible altText, 4-6 relevant tags, ageRange, difficulty, exactly 3 helpful FAQs with brief accurate answers, and choose an existing categoryId from the provided list. No unsupported claims or keyword stuffing. Return JSON only."},{role:"user",content:[{type:"text",text:JSON.stringify({currentTitle:title,imageHint:hint,categories:cats})},{type:"image_url",image_url:{url:imageUrl,detail:"low"}}]}]})});
 const data=await response.json();if(!response.ok)throw Error(data.error?.message||"AI request failed");const content=data.choices?.[0]?.message?.content;if(!content)throw Error("Empty AI response");const seo=JSON.parse(content) as Seo;
 if(!cats.some(c=>c.id===seo.categoryId))throw Error("AI selected unknown category");
 if(!seo.title||!seo.description||!seo.seoTitle||!seo.seoDescription||!seo.altText||!Array.isArray(seo.faqs)||seo.faqs.length!==3)throw Error("Incomplete SEO");
 return seo;
}
export async function POST(request:Request){
 if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
 const body=await request.json();const ids=Array.isArray(body.ids)?Array.from(new Set<number>(body.ids.map(Number).filter((x:number)=>Number.isSafeInteger(x)&&x>0))).slice(0,5):[];
 if(!ids.length)return NextResponse.json({error:"Select up to 5 drafts per batch"},{status:400});
 if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:"OPENAI_API_KEY is missing in Vercel environment variables"},{status:503});
 const cats=await db.select({id:categories.id,name:categories.name}).from(categories);
 const drafts=await db.select().from(coloringPages).where(and(inArray(coloringPages.id,ids),eq(coloringPages.isPublished,false)));
 const results:{id:number;ok:boolean;error?:string;title?:string}[]=[];
 for(const id of ids){
  const page=drafts.find(d=>d.id===id);
  if(!page||!page.imageUrl){results.push({id,ok:false,error:"Draft not found or image missing"});continue;}
  try{
   const seo=await generate(page.imageUrl,page.title,page.description||"",cats);
   const slug=seo.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,85)+"-"+id;
   await db.transaction(async tx=>{
    const updated=await tx.update(coloringPages).set({title:seo.title.slice(0,130),slug,description:seo.description,seoTitle:seo.seoTitle.slice(0,65),seoDescription:seo.seoDescription.slice(0,160),altText:seo.altText.slice(0,250),tags:seo.tags.slice(0,6),ageRange:seo.ageRange.slice(0,50),difficulty:seo.difficulty.slice(0,30),categoryId:seo.categoryId,isPublished:true,publishedAt:new Date()}).where(and(eq(coloringPages.id,id),eq(coloringPages.isPublished,false))).returning({id:coloringPages.id});
    if(!updated.length)throw Error("Draft was already published");
    await tx.delete(faqs).where(eq(faqs.coloringPageId,id));
    await tx.insert(faqs).values(seo.faqs.map((f,i)=>({coloringPageId:id,question:f.question.slice(0,250),answer:f.answer.slice(0,1000),sortOrder:i+1})));
   });
   results.push({id,ok:true,title:seo.title});
  }catch(e){results.push({id,ok:false,error:e instanceof Error?e.message:"Unknown error"});}
 }
 if(results.some(r=>r.ok)){for(const path of ["/","/coloring-pages/","/printable-coloring-pages/","/sitemap.xml"])revalidatePath(path);}
 return NextResponse.json({results});
 }catch(e){console.error(e);return NextResponse.json({error:"Batch failed"},{status:500});}
}
