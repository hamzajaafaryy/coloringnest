import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listPinterestBoards,listPinterestQueue,pinterestConfigured,pinterestConnected } from "@/lib/pinterest-publishing";
export const dynamic="force-dynamic";export const runtime="nodejs";export const maxDuration=60;
export async function GET(){
 if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!pinterestConfigured())return NextResponse.json({configured:false,connected:false,boards:[],jobs:[],scheduleEnabled:false});
 try{
  const connected=await pinterestConnected();
  if(!connected)return NextResponse.json({configured:true,connected:false,boards:[],jobs:[],scheduleEnabled:Boolean(process.env.CRON_SECRET && process.env.CRON_SECRET.length>=16)});
  const jobs=await listPinterestQueue();
  try{return NextResponse.json({configured:true,connected:true,boards:await listPinterestBoards(),jobs,scheduleEnabled:Boolean(process.env.CRON_SECRET && process.env.CRON_SECRET.length>=16)});}
  catch(e){return NextResponse.json({configured:true,connected:true,boards:[],jobs,scheduleEnabled:Boolean(process.env.CRON_SECRET && process.env.CRON_SECRET.length>=16),warning:e instanceof Error?e.message:"Unable to load boards"});}
 }catch(e){return NextResponse.json({configured:true,connected:false,boards:[],jobs:[],scheduleEnabled:Boolean(process.env.CRON_SECRET && process.env.CRON_SECRET.length>=16),error:e instanceof Error?e.message:"Database unavailable"},{status:503});}
}
