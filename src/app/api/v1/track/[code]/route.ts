import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
export const dynamic="force-dynamic";
export async function GET(_request:NextRequest,{params}:{params:Promise<{code:string}>}){
 const {code:raw}=await params;
 const code=raw.trim().toUpperCase();
 const headers={"Cache-Control":"no-store","X-Robots-Tag":"noindex"};
 if(!/^AT-[A-F0-9]{20}$/.test(code)) return NextResponse.json({error:"Invalid tracking reference"},{status:400,headers});
 try{
  const {data,error}=await createAdminClient().from("shipments")
   .select("tracking_code,status,destination_city,created_at,updated_at").eq("tracking_code",code).maybeSingle();
  if(error) return NextResponse.json({error:"Unavailable"},{status:503,headers});
  if(!data) return NextResponse.json({error:"Not found"},{status:404,headers});
  return NextResponse.json(data,{headers});
 }catch{return NextResponse.json({error:"Unavailable"},{status:503,headers});}
}
