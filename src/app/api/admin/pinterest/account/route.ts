import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listPinterestBoards,listPinterestQueue,pinterestConfigured,pinterestConnected } from "@/lib/pinterest-publishing";
export const dynamic="force-dynamic";export const runtime="nodejs";export const maxDuration=60;
export async function GET(){
 if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!pinterestConfigured())return NextResponse.json({configured:false,connected:false,boards:[],jobs:[]});
 try{
  const connected=await pinterestConnected();
  if(!connected)return NextResponse.json({configured:true,connected:false,boards:[],jobs:[]});
  const jobs=await listPinterestQueue();
  try{return NextResponse.json({configured:true,connected:true,boards:await listPinterestBoards(),jobs});}
  catch(e){return NextResponse.json({configured:true,connected:true,boards:[],jobs,warning:e instanceof Error?e.message:"Unable to load boards"});}
 }catch(e){return NextResponse.json({configured:true,connected:false,boards:[],jobs:[],error:e instanceof Error?e.message:"Database unavailable"},{status:503});}
}
