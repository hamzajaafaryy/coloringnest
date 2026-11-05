import { NextRequest,NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { approvePinterestPin,cancelPinterestJob,disconnectPinterest,processPinterestJob,createPinterestSandboxBoard } from "@/lib/pinterest-publishing";
export const runtime="nodejs";export const dynamic="force-dynamic";export const maxDuration=60;
export async function POST(req:NextRequest){
 if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
 if(req.headers.get("origin")!==req.nextUrl.origin)return NextResponse.json({error:"Origin not allowed"},{status:403});
 try{
  const raw=await req.text();
  if(raw.length>4000)return NextResponse.json({error:"Request too large"},{status:413});
  const data=JSON.parse(raw) as Record<string,unknown>;
  if(!data||typeof data!=="object")throw Error("Invalid payload");
  if(data.action==="approve"||data.action==="publishNow"){
    const now=data.action==="publishNow";
    const id=await approvePinterestPin({...data,scheduledAt:now?new Date().toISOString():data.scheduledAt});
    if(now)return NextResponse.json({id,...await processPinterestJob(id)});
    return NextResponse.json({id,status:"approved"});
  }
  if(data.action==="createSandboxBoard"){
    const board=await createPinterestSandboxBoard();
    return NextResponse.json({board});
  }
  if(data.action==="cancel")return NextResponse.json({cancelled:await cancelPinterestJob(String(data.id||""))});
  if(data.action==="disconnect"){await disconnectPinterest();return NextResponse.json({disconnected:true});}
  return NextResponse.json({error:"Unknown action"},{status:400});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Pinterest action failed"},{status:400});}
}
