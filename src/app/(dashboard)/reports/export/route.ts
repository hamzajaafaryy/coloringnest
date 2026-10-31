import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { csvSafe } from "@/lib/format";
export async function GET(){
 const {supabase}=await requireRole(["super_admin","admin","manager","dispatcher","accountant"]);
 const {data,error}=await supabase.from("shipments").select("tracking_code,recipient_name,recipient_phone,destination_city,cod_amount_mad,delivery_fee_mad,status,created_at").order("created_at",{ascending:false}).limit(1000);
 if(error) return NextResponse.json({error:"Export indisponible"},{status:500});
 const keys=["tracking_code","recipient_name","recipient_phone","destination_city","cod_amount_mad","delivery_fee_mad","status","created_at"] as const;
 const lines=[keys.join(";"),...(data??[]).map(row=>keys.map(k=>csvSafe(row[k])).join(";"))];
 const csv="\uFEFF"+lines.join("\r\n");
 return new NextResponse(csv,{status:200,headers:{"Content-Type":"text/csv; charset=utf-8","Content-Disposition":"attachment; filename=\"atlas-shipments.csv\"","Cache-Control":"no-store"}});
}
