"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { stockRoles } from "@/lib/types";
import { uuid } from "@/lib/validation";
function fail(msg:string){redirect("/stock?error="+encodeURIComponent(msg));}
export async function createProductAction(form:FormData){
 const {supabase,profile}=await requireRole(stockRoles);
 const merchant_id=uuid.safeParse(form.get("merchant_id"));
 const name=String(form.get("name")||"").trim();
 const sku=String(form.get("sku")||"").trim().toUpperCase();
 const threshold=Number(form.get("low_stock_threshold")||10);
 if(!merchant_id.success||!name||name.length>120||!sku||sku.length>60||!Number.isInteger(threshold)||threshold<0) fail("Produit invalide");
 const {error}=await supabase.from("products").insert({organization_id:profile.organization_id,merchant_id:merchant_id.data,name,sku,low_stock_threshold:threshold});
 if(error) fail(error.message);
 revalidatePath("/stock");redirect("/stock?success=1");
}
export async function moveStockAction(form:FormData){
 const {supabase}=await requireRole(stockRoles);
 const id=uuid.safeParse(form.get("product_id"));
 const change=Number(form.get("quantity_change"));
 const reason=String(form.get("reason")||"").trim();
 if(!id.success||!Number.isInteger(change)||change===0||Math.abs(change)>1000000||reason.length<3) fail("Mouvement invalide");
 const {error}=await supabase.rpc("add_stock",{p_product_id:id.data,p_change:change,p_reason:reason});
 if(error) fail(error.message);
 revalidatePath("/stock");redirect("/stock?success=1");
}
