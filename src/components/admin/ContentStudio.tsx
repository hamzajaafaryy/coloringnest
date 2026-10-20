"use client";
import {useEffect,useState} from "react";
import Link from "next/link";

type Draft={id:number;title:string;imageUrl:string|null};
type Seo={title:string;slug:string;seoTitle:string;seoDescription:string;description:string;primaryKeyword:string;keywords:string[];altText:string;cardDescription:string;category:string;tags:string[];ageRange:string;difficulty:string;faqs:{question:string;answer:string}[]};
const categories=["Animal","Christmas","Adults","Dinosaur","Easter","Fantasy & Fairy Tales","Flower & Garden","Food & Sweet Treat","Halloween","Holiday & Season","Kindergarten","Mandala","Nature & Landscape","Ocean & Sea Life","Outer Space","Preschool & Toddler","Princess","Sports","Unicorn","Vehicle & Car"];
const rules:{key:keyof Seo;label:string;min:number;max:number;unit:"chars"|"words"|"items"}[]=[
 {key:"title",label:"H1 title",min:35,max:75,unit:"chars"},
 {key:"slug",label:"URL slug",min:15,max:85,unit:"chars"},
 {key:"seoTitle",label:"SEO title",min:45,max:60,unit:"chars"},
 {key:"seoDescription",label:"Meta description",min:140,max:160,unit:"chars"},
 {key:"description",label:"Article description",min:250,max:350,unit:"words"},
 {key:"primaryKeyword",label:"Primary keyword",min:3,max:7,unit:"words"},
 {key:"keywords",label:"Related keywords",min:4,max:6,unit:"items"},
 {key:"altText",label:"Image alt text",min:70,max:125,unit:"chars"},
 {key:"cardDescription",label:"Card description",min:100,max:155,unit:"chars"},
 {key:"tags",label:"Tags",min:4,max:6,unit:"items"},
 {key:"faqs",label:"FAQs",min:3,max:3,unit:"items"}
];
const words=(value:string)=>value.trim()?value.trim().split(/\s+/).length:0;
const count=(value:unknown,unit:string)=>unit==="items"?(Array.isArray(value)?value.length:0):unit==="words"?words(typeof value==="string"?value:""):typeof value==="string"?value.length:0;
const samplePrompt=`You are a professional SEO editor for CraftColoring. Analyze the attached coloring page image carefully and produce only ONE valid JSON object (no markdown) using these exact keys: title, slug, seoTitle, seoDescription, description, primaryKeyword, keywords, altText, cardDescription, category, tags, ageRange, difficulty, faqs. The image is the source of truth. Never invent objects or characters. Use plain, human-sounding American English with specific visual detail; no hype, keyword stuffing, repetitive AI phrases or unverifiable search-volume claims. Write for parents and teachers. Title H1: 35-75 characters, ends in "Coloring Page". Slug: 15-85 lowercase hyphenated characters. SEO title: 45-60 characters, ends in "| CraftColoring". SEO meta: 140-160 characters. Main description: 250-350 words in natural paragraphs. Primary keyword: 3-7 words. Keywords: JSON array of 4-6 relevant distinct long-tail search phrases. Alt text: 70-125 characters. Card description: 100-155 characters. Tags: JSON array of 4-6 strings. Category: choose exactly one from ${categories.join(", ")}. AgeRange: short sensible age group. Difficulty: Easy, Medium, or Hard. FAQs: exactly 3 objects each with question and answer strings; every answer 35-70 words. Before returning, verify all character limits, word counts, and valid JSON syntax. Do not include facts that are not visible in the artwork.`;
export default function ContentStudio(){
 const [file,setFile]=useState<File|null>(null),[json,setJson]=useState(""),[seo,setSeo]=useState<Seo|null>(null),[error,setError]=useState(""),[message,setMessage]=useState(""),[busy,setBusy]=useState(false),[drafts,setDrafts]=useState<Draft[]>([]);
 const [preview,setPreview]=useState("");
 useEffect(()=>{fetch("/api/admin/content-studio",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(j=>{if(j?.drafts)setDrafts(j.drafts);}).catch(()=>{});},[]);
 useEffect(()=>{if(!file){setPreview("");return;}const url=URL.createObjectURL(file);setPreview(url);return ()=>URL.revokeObjectURL(url);},[file]);
 function parse(value:string){setJson(value);setMessage("");try{const x=JSON.parse(value);if(!x||typeof x!=="object"||Array.isArray(x))throw Error("JSON must be an object");setSeo(x as Seo);setError("");}catch(e){setSeo(null);setError(value?(e instanceof Error?e.message:"Invalid JSON"):"");}}
 async function chooseJson(f:File|undefined){if(!f)return;if(f.size>1024*1024){setError("JSON file is too large.");return;}parse(await f.text());}
 const problems:string[]=[];
 if(seo){
  for(const rule of rules){const n=count(seo[rule.key],rule.unit);if(n<rule.min||n>rule.max)problems.push(rule.label+": "+n+" (required "+rule.min+"-"+rule.max+" "+rule.unit+")");}
  if(!seo.title?.endsWith("Coloring Page"))problems.push("Title must end in Coloring Page");
  if(!seo.seoTitle?.endsWith("| CraftColoring"))problems.push("SEO title must end in | CraftColoring");
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(seo.slug||""))problems.push("Slug must be lowercase and hyphenated");
  if(!categories.includes(seo.category))problems.push("Invalid category");
  if(!["Easy","Medium","Hard"].includes(seo.difficulty))problems.push("Difficulty must be Easy, Medium, or Hard");
  if(typeof seo.ageRange!=="string"||!seo.ageRange.trim()||seo.ageRange.length>50)problems.push("Age range must be 1-50 characters");
  for(const k of ["keywords","tags"] as const)if(!Array.isArray(seo[k])||seo[k].some(v=>typeof v!=="string"||!v.trim()||v.length>100))problems.push("Invalid "+k+" array");
  if(!Array.isArray(seo.faqs)||seo.faqs.some(f=>!f||typeof f.question!=="string"||!f.question.trim()||typeof f.answer!=="string"||words(f.answer)<35||words(f.answer)>70))problems.push("Each FAQ needs a question and answer of 35-70 words");
 }
 const valid=!!file&&!!seo&&problems.length===0&&!error;
 async function submit(publish:boolean){if(!valid||!file||!seo)return;setBusy(true);setMessage("Uploading image...");try{
  const form=new FormData();form.append("file",file);form.append("slug",seo.slug);form.append("kind","image");
  const uploaded=await fetch("/api/admin/upload",{method:"POST",body:form});const info=await uploaded.json();if(!uploaded.ok)throw Error(info.error||"Image upload failed");
  setMessage("Saving SEO content and FAQs...");
  const response=await fetch("/api/admin/content-studio",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"importJson",imageUrl:info.url,seo,publish})});const result=await response.json();if(!response.ok)throw Error(result.error||"Save failed");
  setMessage((publish?"Published":"Draft saved")+" successfully! Page #"+result.id+". "+result.warning);
  setDrafts(old=>publish?old:[{id:result.id,title:seo.title,imageUrl:info.url},...old]);setFile(null);setJson("");setSeo(null);
 }catch(e){setMessage("Error: "+(e instanceof Error?e.message:"Unknown error"));}finally{setBusy(false);}}
 return <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
  <div><h1 className="text-3xl font-black">Content Studio — Image + SEO JSON</h1><p className="mt-2 text-slate-600">One coloring page image and one SEO JSON file. No Gemini API required.</p></div>
  <section className="rounded-2xl border bg-white p-5 space-y-4">
   <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-bold">1. Generate SEO JSON with any AI</h2><button type="button" onClick={()=>navigator.clipboard.writeText(samplePrompt).then(()=>setMessage("Master Prompt copied."))} className="rounded-lg bg-violet-100 px-4 py-2 font-semibold text-violet-900">Copy Master Prompt</button></div>
   <p className="text-sm text-slate-600">Send your coloring page image and this prompt to ChatGPT, Gemini or Claude. Copy the resulting JSON or save it as a .json file.</p>
  </section>
  <section className="rounded-2xl border bg-white p-5 space-y-4"><h2 className="text-xl font-bold">2. Upload one coloring page image</h2>
   <input aria-label="Coloring page image" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{const f=e.target.files?.[0]||null;setFile(f&&f.size<=2097152&&["image/png","image/jpeg","image/webp"].includes(f.type)?f:null);if(f&&f.size>2097152)setMessage("Image must be 2 MB or smaller.");}} className="block w-full rounded-lg border p-3" />
   {preview&&<img src={preview} alt="Selected coloring page preview" className="max-h-72 max-w-full rounded-lg border object-contain"/>}
   <p className="text-sm text-slate-500">PNG, JPG or WebP · up to 2 MB.</p>
  </section>
  <section className="rounded-2xl border bg-white p-5 space-y-4"><h2 className="text-xl font-bold">3. Upload or paste SEO JSON</h2>
   <input aria-label="SEO JSON file" type="file" accept=".json,application/json" onChange={e=>void chooseJson(e.target.files?.[0])} className="block w-full rounded-lg border p-3"/>
   <textarea aria-label="SEO JSON text" rows={9} spellCheck={false} className="w-full rounded-lg border p-3 font-mono text-xs" placeholder='Paste the complete JSON object here...' value={json} onChange={e=>parse(e.target.value)}/>
   {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
  </section>
  {seo&&<section className="rounded-2xl border bg-white p-5 space-y-4">
   <h2 className="text-xl font-bold">4. SEO validation & preview</h2>
   <div className="grid gap-2 sm:grid-cols-2">{rules.map(rule=>{const n=count(seo[rule.key],rule.unit),ok=n>=rule.min&&n<=rule.max;return <div key={rule.key} className={"rounded-lg border p-3 text-sm "+(ok?"border-green-200 bg-green-50":"border-red-200 bg-red-50")}><strong>{ok?"✓":"✕"} {rule.label}</strong><div>{n} / {rule.min}-{rule.max} {rule.unit}</div></div>})}</div>
   {problems.length>0&&<div className="rounded-lg bg-red-50 p-3 text-sm text-red-900"><strong>Fix before publishing:</strong><ul className="list-disc pl-5">{problems.map((p,i)=><li key={i}>{p}</li>)}</ul></div>}
   <div className="rounded-xl border p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Search preview</p><p className="text-lg font-semibold text-blue-700">{seo.seoTitle}</p><p className="text-xs text-green-800">coloringnest.vercel.app/coloring-pages/{seo.category?.toLowerCase().replace(/[^a-z0-9]+/g,"-")}/{seo.slug}</p><p className="text-sm text-slate-700">{seo.seoDescription}</p><hr className="my-3"/><h3 className="text-xl font-bold">{seo.title}</h3><p className="mt-1 text-sm text-slate-600">{seo.category} · {seo.ageRange} · {seo.difficulty}</p><p className="mt-3 whitespace-pre-line text-sm">{seo.description}</p><p className="mt-3 text-sm"><b>Alt:</b> {seo.altText}</p><div className="mt-3 space-y-2">{Array.isArray(seo.faqs)&&seo.faqs.map((faq,i)=><div key={i}><strong>{faq.question}</strong><p className="text-sm">{faq.answer}</p></div>)}</div></div>
   <p className="text-xs text-amber-800">Cards show the saved SEO meta description as a short, readable summary. This avoids a database migration. cardDescription is validated but not saved separately; primary and related keywords are kept as searchable tags.</p>
  </section>}
  <div className="flex flex-wrap gap-3"><button disabled={!valid||busy} onClick={()=>void submit(false)} className="rounded-xl bg-slate-800 px-6 py-3 font-bold text-white disabled:opacity-40">Save Draft</button><button disabled={!valid||busy} onClick={()=>void submit(true)} className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white disabled:opacity-40">Publish Page</button></div>
  {message&&<p role="status" className="rounded-xl bg-violet-50 p-4 font-medium text-violet-900">{message}</p>}
  <section className="rounded-2xl border bg-white p-5"><h2 className="text-xl font-bold">Existing drafts ({drafts.length})</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{drafts.map(d=><div key={d.id} className="flex gap-3 rounded-lg border p-3">{d.imageUrl&&<img src={d.imageUrl} alt="" className="h-20 w-16 object-contain"/>}<div><p className="font-semibold">{d.title}</p><Link className="text-sm font-semibold text-violet-700 underline" href={`/admin/coloring-pages/${d.id}/`}>Review or edit draft</Link></div></div>)}</div></section>
 </main>;
}
