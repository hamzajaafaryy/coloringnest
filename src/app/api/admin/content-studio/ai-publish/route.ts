import {NextResponse} from "next/server";
import {and,eq,inArray} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {db} from "@/db";
import {categories,coloringPages,faqs} from "@/db/schema";
import {isAdminAuthenticated} from "@/lib/admin-auth";
export const dynamic="force-dynamic";
export const maxDuration=60;
type Seo={title:string;description:string;seoTitle:string;seoDescription:string;altText:string;tags:string[];ageRange:string;difficulty:string;categoryId:number;faqs:{question:string;answer:string}[]};
const schema={type:"OBJECT",required:["title","description","seoTitle","seoDescription","altText","tags","ageRange","difficulty","categoryId","faqs"],properties:{title:{type:"STRING"},description:{type:"STRING"},seoTitle:{type:"STRING"},seoDescription:{type:"STRING"},altText:{type:"STRING"},tags:{type:"ARRAY",items:{type:"STRING"}},ageRange:{type:"STRING"},difficulty:{type:"STRING"},categoryId:{type:"INTEGER"},faqs:{type:"ARRAY",items:{type:"OBJECT",required:["question","answer"],properties:{question:{type:"STRING"},answer:{type:"STRING"}}}}}};
async function generate(imageUrl:string,title:string,hint:string,cats:{id:number;name:string}[]):Promise<Seo>{
 const key=process.env.GEMINI_API_KEY;if(!key)throw Error("GEMINI_API_KEY is not configured");
 const storage=process.env.SUPABASE_URL?.replace(/\/$/,"");
 const url=new URL(imageUrl);
 if(!storage||!imageUrl.startsWith(storage+"/storage/v1/object/public/coloring-pages/")||url.protocol!=="https:")throw Error("Image is not hosted in trusted storage");
 const imageResponse=await fetch(imageUrl,{redirect:"error",signal:AbortSignal.timeout(15000)});
 if(!imageResponse.ok)throw Error("Unable to retrieve image");
 const mime=(imageResponse.headers.get("content-type")||"").split(";")[0].trim();
 if(!["image/png","image/jpeg","image/webp"].includes(mime))throw Error("Unsupported image type");
 const bytes=Buffer.from(await imageResponse.arrayBuffer());
 if(!bytes.length||bytes.length>2097152)throw Error("Image must be under 2MB");
 const model=process.env.GEMINI_SEO_MODEL||"gemini-2.5-flash";
 if(!/^gemini-[a-z0-9.-]+$/.test(model))throw Error("Invalid Gemini model");
 const prompt="You are an expert English SEO editor for CraftColoring, a family-friendly printable coloring page website. Analyze the ACTUAL uploaded coloring page image; use the image hint as context only and do not claim objects not visible. Create a precise descriptive English title ending in Coloring Page (max 80 chars), 200-300 words of natural SEO description in 3 paragraphs, SEO title max 65 chars ending | CraftColoring, meta description 140-160 chars, accurate accessible alt text, 4-6 tags, suitable age range and difficulty. Select a real categoryId from the list. Generate exactly 3 helpful accurate FAQ questions and answers. No keyword stuffing. Return only structured JSON. Context: "+JSON.stringify({currentTitle:title,imageHint:hint,categories:cats});
 const response=await fetch("https://generativelanguage.googleapis.com/v1beta/models/"+model+":generateContent",{method:"POST",headers:{"x-goog-api-key":key,"Content-Type":"application/json"},signal:AbortSignal.timeout(40000),body:JSON.stringify({contents:[{role:"user",parts:[{text:prompt},{inlineData:{mimeType:mime,data:bytes.toString("base64")}}]}],generationConfig:{temperature:0.4,responseMimeType:"application/json",responseSchema:schema}})});
 const data=await response.json();
 if(!response.ok){const status=response.status;if(status===429)throw Error("Gemini free-tier rate limit reached. Retry later.");throw Error("Gemini API error "+status+": "+String(data.error?.message||"request failed").slice(0,200));}
 const content=data.candidates?.[0]?.content?.parts?.map((p:{text?:string})=>p.text||"").join("");
 if(!content)throw Error("Gemini returned no SEO content");
 const seo=JSON.parse(content) as Seo;
 if(!cats.some(c=>c.id===seo.categoryId))throw Error("AI selected unknown category");
 if(!seo.title||!seo.description||!seo.seoTitle||!seo.seoDescription||!seo.altText||!Array.isArray(seo.faqs)||seo.faqs.length!==3||!Array.isArray(seo.tags))throw Error("Incomplete SEO");
 return seo;
}
export async function POST(request:Request){
 if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
 const body=await request.json();const ids=Array.isArray(body.ids)?Array.from(new Set<number>(body.ids.map(Number).filter((x:number)=>Number.isSafeInteger(x)&&x>0))).slice(0,1):[];
 if(!ids.length)return NextResponse.json({error:"Select one draft per request"},{status:400});
 if(!process.env.GEMINI_API_KEY)return NextResponse.json({error:"GEMINI_API_KEY is missing in Vercel environment variables"},{status:503});
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
