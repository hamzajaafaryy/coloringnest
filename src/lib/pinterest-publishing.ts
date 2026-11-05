import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "node:crypto";
import { pool } from "@/db";
import { getPinterestArtwork } from "./pinterest-data";
// Load the native Sharp renderer only when a specifically approved job is published.
// OAuth / board / account routes must not load libvips at module initialization.
import { makePinSeo, pinArtworkForSheet } from "./pinterest-studio";
import {grantedPinterestScopes,pinterestApiFailure} from "./pinterest-api-diagnostics.ts";
import {
  normalizeApprovedPin, pinterestErrorStatus, type ApprovedPin,
  PINTEREST_ORIGIN, PINTEREST_CALLBACK,
} from "./pinterest-publishing-validation";

/** Pinterest Trial cannot write to Production; use a separate Sandbox OAuth token. */
export type PinterestEnvironment = "sandbox" | "production";
export const pinterestEnvironment = ():PinterestEnvironment =>
  process.env.PINTEREST_API_ENV === "production" ? "production" : "sandbox";
export const pinterestHasStandardAccess = () => process.env.PINTEREST_ACCESS_TIER === "standard";
export const pinterestPublishingAllowed = () => pinterestEnvironment() === "sandbox" || pinterestHasStandardAccess();
const API = pinterestEnvironment() === "sandbox"
  ? "https://api-sandbox.pinterest.com/v5"
  : "https://api.pinterest.com/v5";
export const pinterestConfigured = () => Boolean(
  process.env.PINTEREST_APP_ID &&
  process.env.PINTEREST_APP_SECRET &&
  process.env.PINTEREST_ENCRYPTION_KEY &&
  process.env.PINTEREST_ENCRYPTION_KEY.length >= 32
);
export const pinterestAppId = () => process.env.PINTEREST_APP_ID || "";
function requireConfig() {
  if (!pinterestConfigured()) throw Error("Pinterest app credentials are not configured in Vercel.");
  return {id:process.env.PINTEREST_APP_ID!,secret:process.env.PINTEREST_APP_SECRET!};
}
function cipherKey():Buffer {
  if (!pinterestConfigured()) throw Error("Pinterest encryption key is missing");
  return createHash("sha256").update(process.env.PINTEREST_ENCRYPTION_KEY!).digest();
}
function encryptToken(value:string):string {
  const iv=randomBytes(12), cipher=createCipheriv("aes-256-gcm",cipherKey(),iv);
  const data=Buffer.concat([cipher.update(value,"utf8"),cipher.final()]);
  return Buffer.concat([iv,cipher.getAuthTag(),data]).toString("base64");
}
function decryptToken(value:string):string {
  const buf=Buffer.from(value,"base64");if(buf.length<29)throw Error("Corrupt Pinterest token");
  const decipher=createDecipheriv("aes-256-gcm",cipherKey(),buf.subarray(0,12));
  decipher.setAuthTag(buf.subarray(12,28));
  return Buffer.concat([decipher.update(buf.subarray(28)),decipher.final()]).toString("utf8");
}
let tablesPromise:Promise<void>|undefined;
export async function ensurePinterestTables():Promise<void>{
  if(!tablesPromise){
    tablesPromise=(async()=>{
      await pool.query(`CREATE TABLE IF NOT EXISTS pinterest_connection (
        account_key TEXT PRIMARY KEY CHECK(account_key='primary'),
        access_token_cipher TEXT NOT NULL,refresh_token_cipher TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,scopes TEXT NOT NULL,updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        api_environment TEXT NOT NULL DEFAULT 'production' CHECK(api_environment IN ('production','sandbox'))
      )`);
      await pool.query("ALTER TABLE pinterest_connection ADD COLUMN IF NOT EXISTS api_environment TEXT NOT NULL DEFAULT 'production'");
      await pool.query(`CREATE TABLE IF NOT EXISTS pinterest_publish_jobs (
        id TEXT PRIMARY KEY,approval_key TEXT NOT NULL UNIQUE,page_id BIGINT NOT NULL,
        sheet_id TEXT NOT NULL,board_id TEXT NOT NULL,template TEXT NOT NULL,
        headline TEXT NOT NULL,title TEXT NOT NULL,description TEXT NOT NULL,alt_text TEXT NOT NULL,
        destination TEXT NOT NULL,scheduled_at TIMESTAMPTZ NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('approved','publishing','published','failed','cancelled')),
        error_message TEXT,pinterest_pin_id TEXT,
        approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),published_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        api_environment TEXT NOT NULL DEFAULT 'production' CHECK(api_environment IN ('production','sandbox'))
      )`);
      await pool.query("ALTER TABLE pinterest_publish_jobs ADD COLUMN IF NOT EXISTS api_environment TEXT NOT NULL DEFAULT 'production'");
      if(pinterestEnvironment()==='sandbox' && !pinterestHasStandardAccess())
        await pool.query("UPDATE pinterest_publish_jobs SET status='cancelled',updated_at=now() WHERE status='approved' AND api_environment='production'");
      await pool.query("CREATE INDEX IF NOT EXISTS pinterest_jobs_due_idx ON pinterest_publish_jobs (status,scheduled_at)");
    })().catch(err=>{tablesPromise=undefined;throw err});
  }
  return tablesPromise;
}
type Tokens={access_token:string;refresh_token?:string;expires_in:number;scope?:string};
async function exchangeToken(params:Record<string,string>):Promise<Tokens>{
  const {id,secret}=requireConfig();
  const response=await fetch(API+"/oauth/token",{
    method:"POST",redirect:"error",signal:AbortSignal.timeout(25000),
    headers:{"Authorization":"Basic "+Buffer.from(id+":"+secret).toString("base64"),
             "Content-Type":"application/x-www-form-urlencoded"},
    body:new URLSearchParams(params).toString(),cache:"no-store",
  });
  if(!response.ok)throw Error(pinterestErrorStatus(response.status));
  const token=await response.json() as Tokens;
  if(!token.access_token||!Number.isFinite(token.expires_in))throw Error("Pinterest returned invalid tokens");
  return token;
}
async function storeTokens(token:Tokens,oldRefresh=""):Promise<void>{
  const refresh=token.refresh_token||oldRefresh;
  if(!refresh)throw Error("Pinterest did not supply a refresh token");
  const seconds=Math.max(60,Math.min(2592000,Number(token.expires_in)||3600));
  await ensurePinterestTables();
  await pool.query(`INSERT INTO pinterest_connection
    (account_key,access_token_cipher,refresh_token_cipher,expires_at,scopes,updated_at,api_environment)
    VALUES ('primary',$1,$2,$3,$4,now(),$5)
    ON CONFLICT(account_key) DO UPDATE SET
    access_token_cipher=EXCLUDED.access_token_cipher,
    refresh_token_cipher=EXCLUDED.refresh_token_cipher,
    expires_at=EXCLUDED.expires_at,scopes=EXCLUDED.scopes,
    api_environment=EXCLUDED.api_environment,updated_at=now()`,
    [encryptToken(token.access_token),encryptToken(refresh),
      new Date(Date.now()+seconds*1000),token.scope||"unknown",pinterestEnvironment()]);
}
export async function exchangePinterestAuthorization(code:string):Promise<void>{
  const token=await exchangeToken({grant_type:"authorization_code",code,redirect_uri:PINTEREST_CALLBACK});
  await storeTokens(token);
}
export async function pinterestConnected():Promise<boolean>{
  if(!pinterestConfigured())return false;
  await ensurePinterestTables();
  const r=await pool.query("SELECT account_key FROM pinterest_connection WHERE account_key='primary' AND api_environment=$1 LIMIT 1",[pinterestEnvironment()]);
  return r.rowCount===1;
}
export async function getPinterestAccessToken():Promise<string>{
  requireConfig();await ensurePinterestTables();
  const rows=await pool.query<{access_token_cipher:string;refresh_token_cipher:string;expires_at:Date}>(
    "SELECT access_token_cipher,refresh_token_cipher,expires_at FROM pinterest_connection WHERE account_key='primary' AND api_environment=$1 LIMIT 1",[pinterestEnvironment()]);
  const row=rows.rows[0];if(!row)throw Error("Connect Pinterest Sandbox separately; Production and Sandbox tokens cannot be mixed.");
  if(new Date(row.expires_at).valueOf()>Date.now()+300000)return decryptToken(row.access_token_cipher);
  const refresh=decryptToken(row.refresh_token_cipher);
  const token=await exchangeToken({grant_type:"refresh_token",refresh_token:refresh});
  await storeTokens(token,refresh);
  return token.access_token;
}
async function pinterestApi<T>(method:"GET"|"POST",path:string,body?:unknown):Promise<T>{
  const token=await getPinterestAccessToken();
  const response=await fetch(API+path,{
    method,redirect:"error",signal:AbortSignal.timeout(30000),cache:"no-store",
    headers:{"Authorization":"Bearer "+token,"Accept":"application/json",
      ...(body?{"Content-Type":"application/json"}:{})},
    ...(body?{body:JSON.stringify(body)}:{}),
  });
  if (!response.ok) {
    let payload: unknown = null;
    try { payload = await response.json(); } catch { /* Pinterest can send non-JSON errors */ }
    const safe = pinterestApiFailure(response.status,path,payload);
    console.warn("Pinterest API rejected", method, path, "HTTP", response.status);
    throw Error(safe);
  }
  return response.json() as Promise<T>;
}
export type PinterestAuthStatus = {
  scopes: string[];
  scopeKnown: boolean;
  pinWrite: boolean | null;
  boardWrite: boolean | null;
  publishReady: boolean | null;
  expiresAt: string | null;
};
export async function getPinterestAuthStatus(): Promise<PinterestAuthStatus> {
  await ensurePinterestTables();
  const result=await pool.query<{scopes:string;expires_at:Date}>(
    "SELECT scopes,expires_at FROM pinterest_connection WHERE account_key='primary' AND api_environment=$1 LIMIT 1",[pinterestEnvironment()]);
  const row=result.rows[0];
  if(!row)return {scopes:[],scopeKnown:false,pinWrite:null,boardWrite:null,publishReady:null,expiresAt:null};
  const scopes=grantedPinterestScopes(row.scopes||"");
  const scopeKnown=scopes.length>0;
  return {
    scopes,
    scopeKnown,
    pinWrite:scopeKnown?scopes.includes("pins:write"):null,
    boardWrite:scopeKnown?scopes.includes("boards:write"):null,
    publishReady:scopeKnown?scopes.includes("pins:write") && scopes.includes("boards:write"):null,
    expiresAt:new Date(row.expires_at).toISOString(),
  };
}
export type PinterestBoard={id:string;name:string;privacy?:string};
export async function listPinterestBoards():Promise<PinterestBoard[]>{
  const boards:PinterestBoard[]=[];let bookmark="";
  for(let n=0;n<12;n++){
    const url="/boards?page_size=250"+(bookmark?"&bookmark="+encodeURIComponent(bookmark):"");
    const result=await pinterestApi<{items:PinterestBoard[];bookmark?:string|null}>("GET",url);
    boards.push(...result.items.filter(b=>b.id&&b.name));
    if(!result.bookmark)break;
    bookmark=result.bookmark;
  }
  return boards;
}
export async function createPinterestSandboxBoard():Promise<PinterestBoard>{
  if(pinterestEnvironment()!=="sandbox") throw Error("Sandbox Board creation is unavailable in Production");
  const name="CraftColoring Sandbox Test";
  const existing=await listPinterestBoards();
  const match=existing.find(b=>b.name===name);
  if(match)return match;
  const board=await pinterestApi<PinterestBoard>("POST","/boards",{
    name,description:"Test-only board for CraftColoring official Pinterest API review.",
  });
  if(!board.id)throw Error("Pinterest Sandbox did not return a Board ID");
  return board;
}
async function checkBoard(id:string):Promise<void>{
  if(!/^\d{2,30}$/.test(id))throw Error("Choose an existing Board");
  const board=await pinterestApi<PinterestBoard>("GET","/boards/"+id);
  if(board.id!==id)throw Error("Selected Board could not be verified");
}
export async function disconnectPinterest():Promise<void>{
  await ensurePinterestTables();
  await pool.query("DELETE FROM pinterest_connection WHERE account_key='primary'");
  await pool.query("UPDATE pinterest_publish_jobs SET status='cancelled',updated_at=now() WHERE status='approved'");
}
export type PinterestQueueRow={
  id:string;page_id:string;sheet_id:string;title:string;board_id:string;
  status:string;scheduled_at:string;published_at:string|null;pinterest_pin_id:string|null;
  error_message:string|null;api_environment:PinterestEnvironment;
};
export async function listPinterestQueue():Promise<PinterestQueueRow[]>{
  await ensurePinterestTables();
  const r=await pool.query(`SELECT id,page_id,sheet_id,title,board_id,status,scheduled_at,published_at,
   pinterest_pin_id,error_message,api_environment FROM pinterest_publish_jobs ORDER BY approved_at DESC LIMIT 25`);
  return r.rows as PinterestQueueRow[];
}
export async function approvePinterestPin(input:Record<string,unknown>):Promise<string>{
  if(!pinterestPublishingAllowed())throw Error("Standard Access is required for public Production Pins. Use Sandbox with Trial Access.");
  if(!await pinterestConnected())throw Error("Connect Pinterest before approving Pins");
  const auth=await getPinterestAuthStatus();
  if(auth.publishReady===false)
    throw Error("The connected Pinterest token is missing a required publishing permission (boards:write or pins:write). Use Reconnect Pinterest and grant both before publishing.");
  const approved=normalizeApprovedPin(input);
  const item=await getPinterestArtwork(approved.pageId);
  if(!item)throw Error("The coloring page is not published");
  if(approved.sheetId!=="cover"&&!item.sheets.some(s=>s.id===approved.sheetId))
    throw Error("The collection artwork was not found");
  const art=pinArtworkForSheet(item,approved.sheetId);
  if(!art.imageUrl)throw Error("The coloring page has no publishable image");
  const expected=makePinSeo(item,PINTEREST_ORIGIN,approved.template,approved.sheetId);
  if(new URL(approved.destination).pathname!==new URL(expected.destination).pathname)
    throw Error("Destination must link to this exact coloring page");
  await checkBoard(approved.boardId);
  const key=createHash("sha256").update([
    approved.pageId,approved.sheetId,approved.template,approved.boardId,
    approved.headline,approved.title,approved.description,approved.altText,approved.destination,pinterestEnvironment()
  ].join("|")).digest("hex");
  const id=randomUUID();
  try{
    await pool.query(`INSERT INTO pinterest_publish_jobs
      (id,approval_key,page_id,sheet_id,board_id,template,headline,title,description,
        alt_text,destination,scheduled_at,status,api_environment)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'approved',$13)`,[
      id,key,approved.pageId,approved.sheetId,approved.boardId,approved.template,
      approved.headline,approved.title,approved.description,approved.altText,
      approved.destination,approved.scheduledAt,pinterestEnvironment()
    ]);
  }catch(error){
    if((error as {code?:string}).code==="23505")
      throw Error("This exact Pin has already been approved. Check the queue to avoid duplicates.");
    throw error;
  }
  return id;
}
export async function cancelPinterestJob(id:string):Promise<boolean>{
  if(!/^[a-f0-9-]{36}$/.test(id))throw Error("Invalid job ID");
  const r=await pool.query("UPDATE pinterest_publish_jobs SET status='cancelled',updated_at=now() WHERE id=$1 AND status='approved'",[id]);
  return Boolean(r.rowCount);
}
type Job={id:string;page_id:string;sheet_id:string;board_id:string;template:string;
  headline:string;title:string;description:string;alt_text:string;destination:string};
export async function processPinterestJob(id:string):Promise<{status:"published"|"failed"|"skipped";pinId?:string}>{
  if(!pinterestPublishingAllowed())throw Error("Pinterest Production posting is disabled until Standard Access is confirmed");
  await ensurePinterestTables();
  const result=await pool.query<Job>(`UPDATE pinterest_publish_jobs SET status='publishing',updated_at=now()
    WHERE id=$1 AND status='approved' AND scheduled_at<=now() AND api_environment=$2 RETURNING *`,[id,pinterestEnvironment()]);
  const job=result.rows[0];
  if(!job)return {status:"skipped"};
  try{
    const item=await getPinterestArtwork(Number(job.page_id));
    if(!item)throw Error("Source coloring page was unpublished");
    const artwork=pinArtworkForSheet(item,job.sheet_id);
    if(!artwork.imageUrl)throw Error("Artwork source missing");
    const {fetchPinterestArtworkImage,renderPinterestPin}=await import("./pinterest-render");
    const source=await fetchPinterestArtworkImage(artwork.imageUrl);
    const png=await renderPinterestPin({
      template:job.template as ApprovedPin["template"],headline:job.headline,
      category:item.categoryName,image:source,
    });
    if(png.byteLength>8_000_000)throw Error("Rendered Pin exceeds the upload limit");
    const created=await pinterestApi<{id:string}>("POST","/pins",{
      board_id:job.board_id,title:job.title,description:job.description,
      alt_text:job.alt_text,link:job.destination,
      media_source:{source_type:"image_base64",content_type:"image/png",data:png.toString("base64"),is_standard:true},
    });
    if(!created.id)throw Error("Pinterest response lacked a Pin ID. Check your account.");
    await pool.query(`UPDATE pinterest_publish_jobs
      SET status='published',pinterest_pin_id=$2,published_at=now(),updated_at=now(),error_message=NULL
      WHERE id=$1`,[id,created.id]);
    return {status:"published",pinId:created.id};
  }catch(error){
    // Never automatically retry: network failures can happen after Pinterest accepts the Pin.
    const message=error instanceof Error?error.message:"Pinterest publishing failed";
    await pool.query(`UPDATE pinterest_publish_jobs SET status='failed',
      error_message=$2,updated_at=now() WHERE id=$1`,[id,message.slice(0,500)]);
    return {status:"failed"};
  }
}
export async function processDuePinterestJobs(max=3){
  if(!pinterestPublishingAllowed()||!await pinterestConnected())return [];
  await ensurePinterestTables();
  const r=await pool.query<{id:string}>(`SELECT id FROM pinterest_publish_jobs
    WHERE status='approved' AND scheduled_at<=now() AND api_environment=$2 ORDER BY scheduled_at,approved_at LIMIT $1`,[Math.max(1,Math.min(3,max)),pinterestEnvironment()]);
  const processed=[];
  for(const row of r.rows)processed.push({id:row.id,...await processPinterestJob(row.id)});
  return processed;
}
