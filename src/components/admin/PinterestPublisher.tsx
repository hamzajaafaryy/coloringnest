"use client";

import {useCallback,useEffect,useState} from "react";
import { CalendarClock,CheckCircle2,ExternalLink,Link2,LoaderCircle,Send,ShieldCheck,Unplug,RefreshCcw,XCircle } from "lucide-react";
import type {PinArtwork,PinSeo,PinTemplate} from "@/lib/pinterest-studio";

type Board={id:string;name:string;privacy?:string};
type Job={id:string;page_id:string;sheet_id:string;title:string;board_id:string;
 status:string;scheduled_at:string;published_at:string|null;pinterest_pin_id:string|null;error_message:string|null};
type Account={configured:boolean;connected:boolean;boards:Board[];jobs:Job[];scheduleEnabled?:boolean;warning?:string;error?:string;readCheck?:"ok"|"failed";auth?:{scopes:string[];scopeKnown:boolean;pinWrite:boolean|null;boardWrite:boolean|null;publishReady:boolean|null;expiresAt:string|null}};
type Props={item:PinArtwork|null;seo:PinSeo;template:PinTemplate;sheetId:string;busy:boolean};
const tomorrow=()=>{const date=new Date();date.setUTCDate(date.getUTCDate()+1);return date.toISOString().slice(0,10);};

export default function PinterestPublisher({item,seo,template,sheetId,busy}:Props){
 const [account,setAccount]=useState<Account|null>(null);
 const [boardId,setBoardId]=useState("");
 const [date,setDate]=useState(tomorrow);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");

 const refresh=useCallback(async()=>{
  const r=await fetch("/api/admin/pinterest/account",{cache:"no-store"});
  const data=await r.json();
  if(!r.ok)throw Error(data.error||"Could not read Pinterest connection");
  setAccount(data);
 },[]);
 useEffect(()=>{refresh().catch(e=>setError(e.message));},[refresh]);
 useEffect(()=>{
  const found=account?.boards.find(b=>b.id===boardId);
  if(found)return;
  const exact=account?.boards.find(b=>b.name.toLowerCase()===seo.board.toLowerCase());
  setBoardId(exact?.id||"");
 },[account?.boards,seo.board,boardId]);
 async function action(payload:Record<string,unknown>){
  setError("");setNotice("");setLoading(true);
  try{
   const r=await fetch("/api/admin/pinterest/actions",{
     method:"POST",headers:{"Content-Type":"application/json"},cache:"no-store",body:JSON.stringify(payload),
   });
   const data=await r.json();
   if(!r.ok)throw Error(data.error||"Pinterest action failed");
   if(payload.action==="publishNow"){
    setNotice(data.status==="published"?"Pin published! Pinterest ID: "+data.pinId:
      "Publishing did not complete. Check the queue and your Pinterest account before retrying.");
   }else if(payload.action==="approve")setNotice("Pin approved for daily publishing. It will not post before its selected date.");
   else if(payload.action==="cancel")setNotice("This queued Pin was cancelled.");
   else if(payload.action==="disconnect"){setNotice("Pinterest disconnected. Pending scheduled Pins cancelled.");setBoardId("");}
   await refresh();
  }catch(e){setError(e instanceof Error?e.message:"Could not complete Pinterest action");}
  finally{setLoading(false);}
 }
 function selectedPin(){
  if(!item)throw Error("Choose an artwork");
  if(!boardId)throw Error("Select an existing Pinterest Board");
  if(busy)throw Error("Finish editing your Pin first");
  return {pageId:item.id,sheetId,template,
    headline:seo.headline,title:seo.title,description:seo.description,
    altText:seo.altText,boardId,destination:seo.destination};
 }
 async function publishNow(){
  try{
   const pin=selectedPin();
   const board=account?.boards.find(b=>b.id===boardId)?.name||"this Board";
   if(!window.confirm(`Publish this specific Pin NOW to "${board}"? This sends the artwork to your Pinterest account.`))return;
   await action({...pin,action:"publishNow"});
  }catch(e){setError(e instanceof Error?e.message:"Invalid Pin");}
 }
 async function schedule(){
  try{
   const pin=selectedPin();
   if(!date)throw Error("Choose a day");
   const scheduledAt=new Date(date+"T09:00:00.000Z");
   if(!Number.isFinite(scheduledAt.valueOf()))throw Error("Invalid date");
   if(!window.confirm(`Approve this exact Pin for publishing on ${date} after 09:00 UTC? Vercel Hobby can run at any point within that hour.`))return;
   await action({...pin,action:"approve",scheduledAt:scheduledAt.toISOString()});
  }catch(e){setError(e instanceof Error?e.message:"Invalid date");}
 }
 return <div className="mt-6 space-y-4 rounded-2xl border border-violet-200 bg-gradient-to-b from-[#FAF7FF] to-white p-4">
  <div className="flex flex-wrap items-center justify-between gap-2">
   <h3 className="flex items-center gap-2 text-base font-black text-[#392554]"><Send size={18}/> Pinterest Auto-Publisher</h3>
   <button type="button" onClick={()=>refresh().catch(e=>setError(e.message))} className="rounded-lg bg-white p-2 text-violet-700" aria-label="Refresh Pinterest connection"><RefreshCcw size={16}/></button>
  </div>
  <p className="text-xs leading-5 text-slate-600">Publish directly via official Pinterest API or schedule approved Pins. Only the specific Pin you select and approve will be posted.</p>
  {!account&&<div className="flex items-center gap-2 text-sm text-violet-700"><LoaderCircle size={16} className="animate-spin"/>Loading Pinterest connection…</div>}
  {account&&!account.configured&&<div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
    <p className="font-black">Developer app setup required</p>
    <p>Add PINTEREST_APP_ID, PINTEREST_APP_SECRET and PINTEREST_ENCRYPTION_KEY securely in Vercel Production before connecting. No credentials should be entered into this page.</p>
    <a className="font-bold underline" href="https://developers.pinterest.com/apps/" target="_blank" rel="noopener noreferrer">Open Pinterest Developers</a>
  </div>}
  {account?.configured&&!account.connected&&<div className="space-y-3 rounded-xl bg-white p-3">
    <p className="text-xs font-bold text-slate-700">Pinterest is not connected yet.</p>
    <a href="/api/admin/pinterest/connect" className="flex items-center justify-center gap-2 rounded-xl bg-[#BD1E44] px-4 py-3 text-sm font-black text-white hover:bg-[#9E1637]">
      <Link2 size={17}/> Connect Pinterest securely
    </a>
    <p className="text-xs text-slate-500">Uses OAuth. We never ask for your Pinterest password.</p>
  </div>}
  {account?.connected&&<>
    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800"><CheckCircle2 size={16}/> Pinterest account connected</div>
    <div className="space-y-2 rounded-xl border border-violet-100 bg-white p-3 text-xs leading-5 text-slate-700">
      <p><strong>Boards API:</strong> {account.readCheck==="ok"?"Read access working":account.readCheck==="failed"?"Read access could not be verified":"Not checked"}</p>
      <p><strong>Granted Pin-writing scope:</strong> {account.auth?.pinWrite===true?"pins:write present":account.auth?.pinWrite===false?"pins:write NOT granted":"Not reported by Pinterest"}</p>
      <p><strong>Granted Board-writing scope:</strong> {account.auth?.boardWrite===true?"boards:write present":account.auth?.boardWrite===false?"boards:write NOT granted":"Not reported by Pinterest"}</p>
      <p className="text-[11px] text-slate-500">A successful Board read does not prove publishing access. HTTP 401 can mean invalid credentials or a restricted operation; Trial Pins remain visible only to you.</p>
      <a href="/api/admin/pinterest/connect" className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 font-black text-violet-800 hover:bg-violet-100"><Link2 size={14}/> Reconnect Pinterest (keep queue)</a>
    </div>
    {account.auth?.publishReady===false&&<p role="alert" className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">Publishing requires both boards:write and pins:write. Reconnect and approve the new permissions. Your existing failed Pins will remain in the queue history.</p>}
    {account.warning&&<p role="alert" className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">{account.warning}</p>}
    <label className="block space-y-2 text-xs font-black text-slate-700">
      <span>Choose a real Board</span>
      <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm" value={boardId} onChange={e=>setBoardId(e.target.value)}>
        <option value="">Select a Pinterest Board…</option>
        {account.boards.map(board=><option value={board.id} key={board.id}>{board.name}</option>)}
      </select>
    </label>
    {account.boards.length===0&&<p className="text-xs text-amber-700">No boards returned. Check the connection and your boards:read permission.</p>}
    <button type="button" disabled={!boardId||!item||busy||loading||account.auth?.publishReady===false} onClick={()=>void publishNow()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#BD1E44] px-4 py-3 text-sm font-black text-white disabled:opacity-40">
     {loading?<LoaderCircle size={16} className="animate-spin"/>:<Send size={16}/>} Publish selected Pin now
    </button>
    <div className="rounded-xl border border-violet-100 bg-white p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800"><CalendarClock size={17}/> Approve daily scheduling</p>
      <label className="block text-xs font-semibold text-slate-600">Publication day (09:00 UTC, within the following hour on Hobby)</label>
      <input type="date" min={tomorrow()} value={date} onChange={e=>setDate(e.target.value)} className="my-3 w-full rounded-xl border border-slate-200 p-3 text-sm"/>
      {!account.scheduleEnabled&&<p className="mb-2 text-xs font-bold text-amber-700">Add CRON_SECRET in Vercel to enable scheduled publishing.</p>}
      <button type="button" disabled={!account.scheduleEnabled||!boardId||!item||busy||loading||account.auth?.publishReady===false} onClick={()=>void schedule()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#57338B] px-4 py-3 text-sm font-black text-white disabled:opacity-40">
       <CalendarClock size={16}/> Approve & schedule this Pin
      </button>
      <p className="mt-2 text-[11px] leading-5 text-slate-500">Up to 3 approved Pins are sent per daily run. No automatic retries after ambiguous network errors. Public visibility requires Pinterest Standard API access.</p>
    </div>
    <div className="rounded-xl bg-white p-3">
      <h4 className="mb-2 text-sm font-black">Publishing queue</h4>
      {!account.jobs.length&&<p className="text-xs text-slate-500">No Pins approved yet.</p>}
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {account.jobs.map(job=><div key={job.id} className="rounded-lg border border-slate-100 bg-slate-50 p-2 text-xs">
          <p className="line-clamp-1 font-bold text-slate-800">{job.title}</p>
          <p className="mt-1 text-slate-600">{job.status} · {new Date(job.scheduled_at).toLocaleDateString("en-GB")}</p>
          {job.pinterest_pin_id&&<a target="_blank" rel="noopener noreferrer" href={"https://www.pinterest.com/pin/"+encodeURIComponent(job.pinterest_pin_id)+"/"} className="mt-1 inline-flex items-center gap-1 font-bold text-violet-700">View Pin <ExternalLink size={12}/></a>}
          {job.error_message&&<p className="mt-1 text-red-700">{job.error_message}</p>}
          {job.status==="approved"&&<button type="button" disabled={loading} onClick={()=>void action({action:"cancel",id:job.id})} className="mt-1 font-bold text-rose-700">Cancel approval</button>}
        </div>)}
      </div>
    </div>
    <button type="button" disabled={loading} onClick={()=>{
      if(window.confirm("Disconnect Pinterest and cancel all future scheduled Pins?"))void action({action:"disconnect"});
    }} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-700"><Unplug size={15}/> Disconnect account</button>
  </>}
  {error&&<div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700"><XCircle size={16} className="shrink-0"/>{error}</div>}
  {notice&&<div role="status" className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800"><ShieldCheck size={16} className="shrink-0"/>{notice}</div>}
 </div>;
}
