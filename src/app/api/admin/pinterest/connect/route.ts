import { NextRequest,NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { pinterestConfigured,pinterestAppId } from "@/lib/pinterest-publishing";
import { PINTEREST_CALLBACK,PINTEREST_ORIGIN,PINTEREST_SCOPES } from "@/lib/pinterest-publishing-validation";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(request:NextRequest){
  if(!await isAdminAuthenticated())return NextResponse.redirect(new URL("/admin/login/",request.url));
  if(!pinterestConfigured())return NextResponse.redirect(new URL("/admin/pinterest-studio/?pinterest=not-configured",request.url));
  if(request.nextUrl.origin!==PINTEREST_ORIGIN)return NextResponse.json({error:"Connect from official domain"},{status:400});
  const nonce=randomBytes(32).toString("base64url");
  const url=new URL("https://www.pinterest.com/oauth/");
  url.searchParams.set("client_id",pinterestAppId());
  url.searchParams.set("redirect_uri",PINTEREST_CALLBACK);
  url.searchParams.set("response_type","code");
  url.searchParams.set("scope",PINTEREST_SCOPES);
  url.searchParams.set("state",nonce);
  const response=NextResponse.redirect(url);
  response.cookies.set("pinterest_oauth_state",nonce,{
    httpOnly:true,secure:true,sameSite:"lax",maxAge:600,
    path:"/api/admin/pinterest/connect/callback",
  });
  response.headers.set("Cache-Control","no-store");
  return response;
}
