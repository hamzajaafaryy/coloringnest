"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { editRoles, type ShipmentStatus } from "@/lib/types";
import { shipmentInput, uuid, fromForm } from "@/lib/validation";
function errorUrl(path:string,msg:string) {return path+"?error="+encodeURIComponent(msg.slice(0,160));}
export async function createShipmentAction(form:FormData){
 const {supabase,user,profile}=await requireRole([...editRoles,"merchant"]);
 const parsed=shipmentInput.safeParse(fromForm(form));
 if(!parsed.success) redirect(errorUrl("/shipments/new",parsed.error.issues[0]?.message||"Formulaire invalide"));
 const data=parsed.data;
 if(profile.role==="merchant" && data.merchant_id!==profile.merchant_id) throw new Error("Marchand non autorisé");
 const {data:merchant,error:merchantError}=await supabase.from("merchants").select("id,default_fee_mad").eq("id",data.merchant_id).single();
 if(merchantError||!merchant) redirect(errorUrl("/shipments/new","Marchand introuvable"));
 const fee=profile.role==="merchant"?merchant.default_fee_mad:data.delivery_fee_mad;
 const {data:created,error}=await supabase.from("shipments").insert({
   ...data,delivery_fee_mad:fee,organization_id:profile.organization_id,created_by:user.id
 }).select("id").single();
 if(error||!created) redirect(errorUrl("/shipments/new",error?.message||"Échec de création"));
 revalidatePath("/dashboard"); revalidatePath("/shipments");
 redirect("/shipments/"+created.id);
}
export async function setShipmentStatusAction(form:FormData){
 const {supabase}=await requireRole([...editRoles,"warehouse","driver"]);
 const id=uuid.parse(form.get("id"));
 const status=String(form.get("status")) as ShipmentStatus;
 const comment=String(form.get("comment")||"").slice(0,500);
 const {error}=await supabase.rpc("change_shipment_status",{p_shipment_id:id,p_new_status:status,p_comment:comment});
 if(error) redirect(errorUrl("/shipments/"+id,error.message));
 revalidatePath("/shipments");revalidatePath("/shipments/"+id);revalidatePath("/dashboard");
 redirect("/shipments/"+id);
}
export async function assignDriverAction(form:FormData){
 const {supabase}=await requireRole(editRoles);
 const id=uuid.parse(form.get("id"));
 const driver=uuid.parse(form.get("driver_id"));
 const {error}=await supabase.rpc("assign_driver",{p_shipment_id:id,p_driver_id:driver});
 if(error) redirect(errorUrl("/shipments/"+id,error.message));
 revalidatePath("/shipments/"+id);
 redirect("/shipments/"+id);
}
