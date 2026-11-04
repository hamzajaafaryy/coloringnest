"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine, ArrowLeft, ArrowRight, Check, CheckCheck, ChevronLeft, ChevronRight,
  Clipboard, ExternalLink, Images, LayoutTemplate, LoaderCircle, Search, Sparkles,
  WandSparkles, X, FileArchive, RefreshCw, ShieldCheck,
} from "lucide-react";
import {
  PIN_TEMPLATES, makePinSeo, pinArtworkForSheet, safePinName,
  type PinArtwork, type PinSeo, type PinTemplate,
} from "@/lib/pinterest-studio";
import { getColoringImageAssets } from "@/lib/coloring-image-assets";
import { makePinZip, seoCsvRow } from "@/lib/pinterest-zip";

type Catalog = {items:PinArtwork[];page:number;pageCount:number;total:number};
const LABELS: Record<PinTemplate,{title:string;tag:string;swatch:string}> = {
  editorial:{title:"Editorial",tag:"Timeless · Cream",swatch:"from-amber-50 via-white to-violet-200"},
  lilac:{title:"Lilac Pop",tag:"Bright · Playful",swatch:"from-violet-300 via-fuchsia-100 to-yellow-200"},
  sunshine:{title:"Sunshine",tag:"Happy · Warm",swatch:"from-yellow-200 via-amber-100 to-orange-200"},
  midnight:{title:"Midnight",tag:"Bold · Contrast",swatch:"from-slate-900 via-violet-900 to-indigo-600"},
  papercut:{title:"Paper Cut",tag:"Fresh · Artistic",swatch:"from-emerald-100 via-teal-100 to-orange-100"},
};
const ORIGIN = "https://www.craftcoloring.com";
const MAX_BULK = 8;
const EMPTY_SEO: PinSeo = {title:"",description:"",altText:"",headline:"",board:"",destination:""};

function downloadBlob(blob:Blob,filename:string){
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a");
  anchor.href=url; anchor.download=filename; document.body.appendChild(anchor); anchor.click();
  anchor.remove(); window.setTimeout(()=>URL.revokeObjectURL(url),1500);
}
async function requestRender(item:PinArtwork, template:PinTemplate, sheetId:string, headline:string, signal?:AbortSignal):Promise<Blob>{
  const response=await fetch("/api/admin/pinterest/render",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({id:item.id,template,sheetId,headline}),cache:"no-store",signal,
  });
  if(!response.ok){
    let message="Could not generate this image.";
    try { const result=await response.json(); message=result.error||message; } catch{}
    if(response.status===401) message="Admin session expired. Sign in again.";
    throw Error(message);
  }
  return response.blob();
}

function CopyAction({value,label="Copy"}:{value:string;label?:string}){
  const [copied,setCopied]=useState(false);
  return <button type="button" onClick={async()=>{
    try {await navigator.clipboard.writeText(value);setCopied(true);setTimeout(()=>setCopied(false),1800);}
    catch {setCopied(false);}
  }} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-violet-100 bg-white px-2.5 py-1.5 text-[11px] font-bold text-violet-700 hover:bg-violet-50" aria-label={label}>
    {copied?<Check size={13}/>:<Clipboard size={13}/>} {copied?"Copied":label}
  </button>;
}

function MetaField({label,value,max,rows=1,onChange}:{label:string;value:string;max:number;rows?:number;onChange:(v:string)=>void}){
  return <div className="space-y-2">
    <div className="flex items-center justify-between gap-3">
      <label className="text-xs font-extrabold uppercase tracking-[.12em] text-slate-500">{label}</label>
      <span className={`text-xs tabular-nums ${value.length>max?"text-red-600":"text-slate-400"}`}>{value.length}/{max}</span>
    </div>
    {rows===1?<input value={value} maxLength={max} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"/>:
      <textarea value={value} rows={rows} maxLength={max} onChange={e=>onChange(e.target.value)} className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"/>}
  </div>;
}

export default function PinterestStudio(){
  const [searchInput,setSearchInput]=useState("");
  const [search,setSearch]=useState("");
  const [page,setPage]=useState(1);
  const [catalog,setCatalog]=useState<Catalog>({items:[],page:1,pageCount:1,total:0});
  const [catalogBusy,setCatalogBusy]=useState(true);
  const [activeId,setActiveId]=useState<number|null>(null);
  const [sheetId,setSheetId]=useState("cover");
  const [template,setTemplate]=useState<PinTemplate>("editorial");
  const [seo,setSeo]=useState<PinSeo>(EMPTY_SEO);
  const [preview,setPreview]=useState("");
  const [previewBusy,setPreviewBusy]=useState(false);
  const [previewHeadline,setPreviewHeadline]=useState("");
  const [selected,setSelected]=useState<number[]>([]);
  const [exportBusy,setExportBusy]=useState(false);
  const [progress,setProgress]=useState("");
  const [error,setError]=useState("");

  useEffect(()=>{
    const controller=new AbortController();
    setCatalogBusy(true);setError("");
    fetch("/api/admin/pinterest?"+new URLSearchParams({q:search,page:String(page)}),{
      cache:"no-store",signal:controller.signal,
    }).then(async response=>{
      if(!response.ok)throw Error(response.status===401?"Admin session expired. Please log in.":"Unable to load artwork.");
      return response.json();
    }).then((data:Catalog)=>{
      if(!controller.signal.aborted){
        setCatalog(data);
        setActiveId(previous=>data.items.some(x=>x.id===previous)?previous:(data.items[0]?.id??null));
        setSelected([]);
        setCatalogBusy(false);
      }
    }).catch(e=>{if(!controller.signal.aborted){setError(String(e.message||e));setCatalogBusy(false);}});
    return ()=>controller.abort();
  },[search,page]);

  const active=useMemo(()=>catalog.items.find(item=>item.id===activeId)||null,[catalog.items,activeId]);
  const activeImage=active?pinArtworkForSheet(active,sheetId):null;
  useEffect(()=>{
    if(!active)return;
    const defaultSeo=makePinSeo(active,ORIGIN,template,sheetId);
    setSeo(defaultSeo);
    if(!pinArtworkForSheet(active,sheetId).imageUrl){
      setPreview("");setError("This page does not have a PNG/JPEG/WebP cover yet.");
      return;
    }
    const controller=new AbortController();
    setError("");setPreviewBusy(true);setPreviewHeadline("");
    requestRender(active,template,sheetId,defaultSeo.headline,controller.signal)
      .then(blob=>{if(!controller.signal.aborted){setPreview(URL.createObjectURL(blob));setPreviewHeadline(defaultSeo.headline);setPreviewBusy(false);}})
      .catch(e=>{if(!controller.signal.aborted){setPreviewBusy(false);setError(String(e.message||e));}});
    return ()=>controller.abort();
  },[active,template,sheetId]);

  useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview);},[preview]);

  const selectedItems=useMemo(()=>catalog.items.filter(item=>selected.includes(item.id)),[catalog.items,selected]);
  function pick(item:PinArtwork){setActiveId(item.id);setSheetId("cover");setError("");}
  function toggle(id:number){
    setSelected(old=>old.includes(id)?old.filter(v=>v!==id):old.length>=MAX_BULK?old:[...old,id]);
  }
  function updateSeo(field:keyof PinSeo,value:string){setSeo(old=>({...old,[field]:value}));}

  async function refreshPreview(){
    if(!active||!activeImage?.imageUrl)return;
    setPreviewBusy(true);setError("");
    try{
      const result=await requestRender(active,template,sheetId,seo.headline);
      setPreview(URL.createObjectURL(result));setPreviewHeadline(seo.headline);
    }catch(e){setError(e instanceof Error?e.message:"Unable to render.");}
    finally{setPreviewBusy(false);}
  }
  async function download(){
    if(!active||!activeImage?.imageUrl)return;
    setExportBusy(true);setError("");
    try{
      const result=await requestRender(active,template,sheetId,seo.headline);
      downloadBlob(result,safePinName(active,template,sheetId));
      setPreview(URL.createObjectURL(result));setPreviewHeadline(seo.headline);
      setProgress("Downloaded high-resolution PNG · 1000 × 1500");
    }catch(e){setError(e instanceof Error?e.message:"Download failed.");}
    finally{setExportBusy(false);}
  }
  async function exportZip(){
    if(!selectedItems.length||selectedItems.length>MAX_BULK)return;
    setExportBusy(true);setError("");
    try{
      const entries:{name:string;data:Uint8Array}[]=[];
      const rows:string[][]=[["image_filename","pin_title","pin_description","alt_text","board_suggestion","destination_url","template","source_artwork"]];
      for(let index=0;index<selectedItems.length;index++){
        const item=selectedItems[index];
        setProgress(`Creating pin ${index+1} of ${selectedItems.length}…`);
        const currentSheet=item.id===activeId?sheetId:"cover";
        const metadata=item.id===activeId?seo:makePinSeo(item,ORIGIN,template,currentSheet);
        const image=await requestRender(item,template,currentSheet,metadata.headline);
        const filename=safePinName(item,template,currentSheet);
        entries.push({name:filename,data:new Uint8Array(await image.arrayBuffer())});
        rows.push([filename,metadata.title,metadata.description,metadata.altText,metadata.board,metadata.destination,template,item.title]);
      }
      const csv=rows.map(seoCsvRow).join("\r\n");
      entries.push({name:"pinterest-seo.csv",data:new TextEncoder().encode("\ufeff"+csv)});
      entries.push({name:"READ-ME.txt",data:new TextEncoder().encode(
        "CraftColoring Pinterest Studio\n\n1. Review each image and its matching row in pinterest-seo.csv.\n2. Upload to your own Pinterest account and select an existing Board.\n3. Paste the title, description, alt text and destination URL.\n4. These are prepared drafts, not automatically posted Pins.\n\nAll images are 1000x1500 PNG, optimized for the 2:3 Pinterest format.\n"
      )});
      const data=makePinZip(entries);
      downloadBlob(new Blob([new Uint8Array(data)],{type:"application/zip"}),`craftcoloring-pinterest-${new Date().toISOString().slice(0,10)}.zip`);
      setProgress(`Exported ${selectedItems.length} Pin(s) with SEO CSV in one ZIP.`);
    }catch(e){setError(e instanceof Error?e.message:"Bulk export failed.");setProgress("");}
    finally{setExportBusy(false);}
  }
  async function copyAll(){
    try{
      await navigator.clipboard.writeText(
        "TITLE\n"+seo.title+"\n\nDESCRIPTION\n"+seo.description+
        "\n\nALT TEXT\n"+seo.altText+"\n\nBOARD\n"+seo.board+
        "\n\nLINK\n"+seo.destination
      );
      setProgress("Pinterest SEO copied to clipboard.");
    }catch{setError("Clipboard not available in this browser.");}
  }

  return <main className="min-h-screen bg-[#F7F6FB] pb-16 text-[#28223C]">
    <section className="relative overflow-hidden bg-[#231739] text-white">
      <div className="pointer-events-none absolute -right-24 -top-48 h-[430px] w-[430px] rounded-full bg-fuchsia-500/20 blur-[110px]"/>
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-52 w-80 rounded-full bg-indigo-400/10 blur-[80px]"/>
      <div className="relative mx-auto max-w-[1560px] px-4 py-9 sm:px-8 sm:py-11">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.25em] text-violet-200">
            <Sparkles size={17}/> CraftColoring / Creative tools
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white/90"><ShieldCheck size={15}/> Private admin workspace</span>
        </div>
        <div className="mt-5 grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[.22em] text-[#EFCF8A]">Pinterest Content Engine</p>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">Create pins worth saving<span className="text-[#E7BCFA]">.</span></h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">One-click layouts, search-ready copy and clean exports, powered by your original coloring pages. No extra subscriptions or watermarks.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center sm:gap-3">
            {[[String(PIN_TEMPLATES.length),"Designs"],["2:3","Pin ratio"],["FREE","Generator"]].map(([num,label])=>
              <div key={label} className="min-w-24 rounded-2xl border border-white/15 bg-white/10 px-3 py-4">
                <p className="text-xl font-black text-white">{num}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">{label}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>

    <div className="mx-auto max-w-[1560px] space-y-5 px-3 py-6 sm:px-6">
      {error && <div role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"><X size={19}/>{error}</div>}
      {progress && !error && <div role="status" className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"><CheckCheck size={18}/>{progress}</div>}

      <div className="grid items-start gap-5 xl:grid-cols-[300px_minmax(350px,1fr)_360px] 2xl:grid-cols-[340px_minmax(400px,1fr)_390px]">
        <section className="rounded-[1.6rem] border border-[#E9E4F1] bg-white p-4 shadow-[0_12px_45px_rgba(52,34,78,0.05)]">
          <div className="mb-4 flex items-start justify-between">
            <div><p className="text-[10px] font-black uppercase tracking-[.18em] text-violet-500">Step 01 / Artwork</p><h2 className="mt-1 text-xl font-black">Your library</h2></div>
            <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">{catalog.total}</span>
          </div>
          <form onSubmit={e=>{e.preventDefault();setPage(1);setSearch(searchInput.trim());}} className="mb-4 flex gap-2">
            <label className="relative min-w-0 flex-1">
              <Search size={17} className="pointer-events-none absolute left-3 top-3.5 text-slate-400"/>
              <input aria-label="Search published coloring pages" value={searchInput} onChange={e=>setSearchInput(e.target.value)}
                placeholder="Search drawings..." className="w-full rounded-xl border border-slate-200 bg-[#FBFAFD] py-3 pl-10 pr-3 text-sm outline-none focus:border-violet-400"/>
            </label>
            <button aria-label="Search" className="rounded-xl bg-violet-700 px-3 text-white hover:bg-violet-800"><ArrowRight size={20}/></button>
          </form>
          <div className="mb-3 flex items-center justify-between gap-1 text-xs">
            <span className="font-bold text-slate-500">Choose a published artwork</span>
            <button type="button" onClick={()=>setSelected(catalog.items.filter(x=>x.imageUrl).slice(0,MAX_BULK).map(x=>x.id))}
              className="font-bold text-violet-700 hover:underline">Select up to 8</button>
          </div>
          <div className="max-h-[650px] space-y-2 overflow-y-auto pr-1">
            {catalogBusy && <div className="flex items-center gap-2 p-6 text-sm text-slate-500"><LoaderCircle size={16} className="animate-spin"/>Loading library…</div>}
            {!catalogBusy && !catalog.items.length && <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No published drawings match this search.</p>}
            {catalog.items.map(item=>{
              const on=item.id===activeId,checked=selected.includes(item.id);
              return <div key={item.id} className={`group flex gap-2 rounded-2xl border p-2 transition ${on?"border-violet-400 bg-violet-50 ring-1 ring-violet-100":"border-slate-100 hover:border-violet-200 hover:bg-slate-50"}`}>
                <input type="checkbox" aria-label={`Select ${item.title} for bulk export`} checked={checked} onChange={()=>toggle(item.id)}
                  className="mt-8 h-4 w-4 shrink-0 accent-violet-600"/>
                <button type="button" onClick={()=>pick(item)} aria-pressed={on} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <div className="flex h-[76px] w-[67px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-slate-100">
                    {item.imageUrl?<img src={getColoringImageAssets(item.imageUrl).thumbnailUrl} alt="" className="h-full w-full object-contain p-1" loading="lazy"/>:
                      <Images size={25} className="text-slate-300"/>}
                  </div>
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-xs font-extrabold leading-5 text-slate-800">{item.title}</span>
                    <span className="mt-1 block truncate text-[11px] text-slate-500">{item.categoryName||"Uncategorized"}</span>
                    {item.sheets.length>0 && <span className="mt-1 block text-[10px] font-bold text-violet-600">{item.sheets.length+1} drawings in collection</span>}
                  </span>
                </button>
              </div>;
            })}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
            <button type="button" disabled={catalog.page<=1||catalogBusy} onClick={()=>setPage(p=>p-1)} className="flex items-center gap-1 disabled:opacity-30"><ChevronLeft size={17}/> Previous</button>
            <span>Page {catalog.page} / {catalog.pageCount}</span>
            <button type="button" disabled={catalog.page>=catalog.pageCount||catalogBusy} onClick={()=>setPage(p=>p+1)} className="flex items-center gap-1 disabled:opacity-30">Next <ChevronRight size={17}/></button>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-[#E9E4F1] bg-white p-4 shadow-[0_12px_45px_rgba(52,34,78,0.05)] sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-[10px] font-black uppercase tracking-[.18em] text-violet-500">Step 02 / Design</p><h2 className="mt-1 text-xl font-black">Pin canvas</h2></div>
            <span className="rounded-full bg-[#F3EDF9] px-3 py-2 text-xs font-bold text-violet-700">1000 × 1500 · PNG</span>
          </div>
          <div className="mb-4 grid grid-cols-5 gap-2">
            {PIN_TEMPLATES.map(key=><button type="button" key={key} aria-pressed={template===key} onClick={()=>setTemplate(key)}
              className={`rounded-2xl border p-1.5 text-center transition ${template===key?"border-violet-600 bg-violet-50 ring-2 ring-violet-100":"border-slate-100 hover:border-violet-200"}`}>
              <span className={`block h-12 rounded-xl bg-gradient-to-br ${LABELS[key].swatch}`}/>
              <span className="mt-2 block truncate text-[10px] font-black sm:text-xs">{LABELS[key].title}</span>
            </button>)}
          </div>
          {active && active.sheets.length>0 && <div className="mb-4">
            <label htmlFor="pinterest-sheet" className="mb-2 block text-xs font-bold text-slate-600">Artwork inside the collection</label>
            <select id="pinterest-sheet" value={sheetId} onChange={e=>setSheetId(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm">
              <option value="cover">Cover · {active.title}</option>
              {active.sheets.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>}
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_40%_30%,#f9eaff,transparent_55%),#F1ECF6] p-5 sm:p-7">
            <div className="pointer-events-none absolute -left-8 top-7 h-20 w-20 rounded-full border-8 border-violet-100"/>
            <div className="relative w-full max-w-[350px] overflow-hidden rounded-[1.25rem] bg-white shadow-[0_25px_65px_rgba(43,20,73,0.2)]" style={{aspectRatio:"2 / 3"}}>
              {preview && <img src={preview} alt="Live exported Pinterest Pin design preview" className="h-full w-full object-contain"/>}
              {!preview && <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#FFFCF5] to-[#E9D7FA] p-8 text-center"><WandSparkles size={44} className="text-violet-500"/><span className="mt-3 text-lg font-black">Select an artwork</span><span className="mt-2 text-sm text-violet-700">See the full-size pin preview here.</span></div>}
              {previewBusy && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/85 backdrop-blur-sm"><LoaderCircle size={30} className="animate-spin text-violet-700"/><p className="text-xs font-black uppercase tracking-widest text-violet-700">Rendering your design</p></div>}
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">Full-resolution preview · original line art preserved</p>
          {preview && seo.headline!==previewHeadline && <p className="mt-2 text-center text-xs font-bold text-amber-700">Headline changed — refresh the preview or download to apply.</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" disabled={!active||previewBusy} onClick={()=>void refreshPreview()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-bold text-violet-700 hover:bg-violet-50 disabled:opacity-40"><RefreshCw size={16}/> Refresh preview</button>
            <button type="button" disabled={!active||previewBusy||exportBusy||!activeImage?.imageUrl} onClick={()=>void download()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6F3BA2] px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 hover:bg-[#592C89] disabled:opacity-40"><ArrowDownToLine size={17}/> Download PNG</button>
          </div>
          <div className="mt-5 rounded-2xl border border-dashed border-violet-200 bg-[#FAF7FE] p-4">
            <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-sm font-black"><FileArchive size={19} className="text-violet-700"/> Bulk export</span><span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-violet-700">{selected.length}/{MAX_BULK}</span></div>
            <p className="mt-2 text-xs leading-5 text-slate-500">Choose up to 8 items on the left. Get one ZIP with ready-to-upload PNGs and a Pinterest SEO spreadsheet.</p>
            <button type="button" disabled={!selectedItems.length||exportBusy||previewBusy} onClick={()=>void exportZip()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#28203C] px-4 py-3 text-sm font-black text-white hover:bg-[#41305E] disabled:opacity-40">
              {exportBusy?<LoaderCircle size={17} className="animate-spin"/>:<FileArchive size={17}/>}
              {exportBusy?"Preparing files…":`Export ${selectedItems.length} Pin(s) + SEO ZIP`}
            </button>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-[#E9E4F1] bg-white p-4 shadow-[0_12px_45px_rgba(52,34,78,0.05)] sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-2">
            <div><p className="text-[10px] font-black uppercase tracking-[.18em] text-violet-500">Step 03 / Discovery</p><h2 className="mt-1 text-xl font-black">Pinterest SEO</h2></div>
            <span className="rounded-xl bg-emerald-50 px-2.5 py-2 text-[10px] font-black text-emerald-700">EDITABLE</span>
          </div>
          <p className="mb-5 text-xs leading-5 text-slate-500">Titles and descriptions come from the real coloring page. Review them before posting. No fake search-volume claims.</p>
          <div className="space-y-5">
            <MetaField label="Headline on image" value={seo.headline} max={90} onChange={v=>updateSeo("headline",v)}/>
            <div className="flex items-center gap-2 rounded-xl border border-[#F1E5D2] bg-[#FFF9F1] px-3 py-3 text-xs leading-5 text-amber-800"><WandSparkles size={16} className="shrink-0"/>Edit the image headline, then click Refresh Preview to regenerate the real PNG.</div>
            <MetaField label="Pin title" value={seo.title} max={100} onChange={v=>updateSeo("title",v)}/>
            <MetaField label="Pin description" value={seo.description} max={500} rows={5} onChange={v=>updateSeo("description",v)}/>
            <MetaField label="Alt text" value={seo.altText} max={500} rows={3} onChange={v=>updateSeo("altText",v)}/>
            <MetaField label="Suggested board (editable)" value={seo.board} max={100} onChange={v=>updateSeo("board",v)}/>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><label className="text-xs font-extrabold uppercase tracking-[.12em] text-slate-500">Destination + UTM</label><CopyAction label="Copy" value={seo.destination}/></div>
              <p className="break-all rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">{seo.destination||"Choose a drawing first."}</p>
            </div>
            <button type="button" onClick={()=>void copyAll()} disabled={!active} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-extrabold text-violet-800 hover:bg-violet-100 disabled:opacity-40"><Clipboard size={16}/> Copy all Pinterest SEO</button>
            {active && <a href={seo.destination} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50">Open destination <ExternalLink size={15}/></a>}
          </div>
          <div className="mt-6 space-y-2 rounded-2xl bg-[#F7F5FA] p-4 text-xs leading-5 text-slate-600">
            <div className="flex items-center gap-2 font-black text-slate-800"><ShieldCheck size={16} className="text-emerald-700"/> Your publishing controls</div>
            <p>Designs are exported as drafts. Nothing is posted to Pinterest automatically. Select a real Board and approve each Pin before publishing.</p>
          </div>
        </section>
      </div>
    </div>
  </main>;
}
