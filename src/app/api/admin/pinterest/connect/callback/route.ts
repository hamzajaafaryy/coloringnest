import { NextRequest,NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { exchangePinterestAuthorization } from "@/lib/pinterest-publishing";
import { PINTEREST_ORIGIN } from "@/lib/pinterest-publishing-validation";
export const runtime="nodejs";export const dynamic="force-dynamic";export const maxDuration=60;
function equal(a:string,b:string){
 const x=Buffer.from(a),y=Buffer.from(b);
 return x.length===y.length&&timingSafeEqual(x,y);
}
export async function GET(req:NextRequest){
 const saved=req.cookies.get("pinterest_oauth_state")?.value||"";
 const state=req.nextUrl.searchParams.get("state")||"";
 const code=req.nextUrl.searchParams.get("code")||"";
 const base=PINTEREST_ORIGIN+"/admin/pinterest-studio/";
 const fail=(reason:string)=>NextResponse.redirect(new URL(base+"?pinterest="+reason),303);
 if(req.nextUrl.origin!==PINTEREST_ORIGIN||!await isAdminAuthenticated()||!saved||!state||!equal(saved,state)||!code){
  const bad=fail("auth-error");bad.cookies.set("pinterest_oauth_state","",{path:"/api/admin/pinterest/connect/callback",expires:new Date(0)});return bad;
 }
 let response:NextResponse;
 try{await exchangePinterestAuthorization(code);response=NextResponse.redirect(new URL(base+"?pinterest=connected"),303);}
 catch(error){console.error("Pinterest OAuth failed",error instanceof Error?error.message:"Unknown");response=fail("connection-failed");}
 response.cookies.set("pinterest_oauth_state","",{path:"/api/admin/pinterest/connect/callback",expires:new Date(0),httpOnly:true,secure:true,sameSite:"lax"});
 response.headers.set("Cache-Control","no-store");
 return response;
}
