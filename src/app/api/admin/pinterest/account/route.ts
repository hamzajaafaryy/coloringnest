import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listPinterestBoards,listPinterestQueue,pinterestConfigured,pinterestConnected,getPinterestAuthStatus,pinterestEnvironment,pinterestHasStandardAccess,pinterestPublishingAllowed } from "@/lib/pinterest-publishing";
export const dynamic="force-dynamic";export const runtime="nodejs";export const maxDuration=60;
export async function GET(){
 if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
 const mode={environment:pinterestEnvironment(),standardAccess:pinterestHasStandardAccess(),publishingAllowed:pinterestPublishingAllowed()};
 if(!pinterestConfigured())return NextResponse.json({...mode,configured:false,connected:false,boards:[],jobs:[],scheduleEnabled:false});
 try{
  const connected=await pinterestConnected();
  if(!connected)return NextResponse.json({...mode,configured:true,connected:false,boards:[],jobs:[],scheduleEnabled:Boolean(process.env.CRON_SECRET && process.env.CRON_SECRET.length>=16)});
  const [jobs,auth]=await Promise.all([listPinterestQueue(),getPinterestAuthStatus()]);
  try{return NextResponse.json({...mode,configured:true,connected:true,boards:await listPinterestBoards(),jobs,auth,readCheck:"ok",scheduleEnabled:Boolean(process.env.CRON_SECRET && process.env.CRON_SECRET.length>=16)});}
  catch(e){return NextResponse.json({...mode,configured:true,connected:true,boards:[],jobs,auth,readCheck:"failed",scheduleEnabled:Boolean(process.env.CRON_SECRET && process.env.CRON_SECRET.length>=16),warning:e instanceof Error?e.message:"Unable to load boards"});}
 }catch(e){return NextResponse.json({...mode,configured:true,connected:false,boards:[],jobs:[],scheduleEnabled:Boolean(process.env.CRON_SECRET && process.env.CRON_SECRET.length>=16),error:e instanceof Error?e.message:"Database unavailable"},{status:503});}
}
