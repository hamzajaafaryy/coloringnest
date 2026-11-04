import { NextRequest,NextResponse } from "next/server";
import { processDuePinterestJobs } from "@/lib/pinterest-publishing";
export const runtime="nodejs";export const dynamic="force-dynamic";export const maxDuration=60;
export async function GET(request:NextRequest){
 const secret=process.env.CRON_SECRET;
 if(!secret||secret.length<16)return NextResponse.json({disabled:true},{status:503});
 if(request.headers.get("authorization")!=="Bearer "+secret)return NextResponse.json({error:"Unauthorized"},{status:401});
 try{const results=await processDuePinterestJobs(3);return NextResponse.json({processed:results.length,results});}
 catch(error){console.error("Pinterest cron failed",error instanceof Error?error.message:"unknown");return NextResponse.json({error:"Scheduler error"},{status:503});}
}
