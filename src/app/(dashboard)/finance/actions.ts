"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { financeRoles } from "@/lib/types";
import { uuid } from "@/lib/validation";
function fail(msg:string){redirect("/finance?error="+encodeURIComponent(msg.slice(0,160)));}
export async function receiveCashAction(form:FormData){
 const {supabase}=await requireRole(financeRoles);
 const shipment=uuid.safeParse(form.get("shipment_id"));
 if(!shipment.success) fail("ID de colis invalide");
 const {error}=await supabase.rpc("receive_cod",{p_shipment_id:shipment.data});
 if(error) fail(error.message);
 revalidatePath("/finance");redirect("/finance?success=1");
}
export async function createSettlementAction(form:FormData){
 const {supabase}=await requireRole(financeRoles);
 const merchant=uuid.safeParse(form.get("merchant_id"));
 const selected=form.getAll("shipment_id").map(String);
 if(!merchant.success||!selected.length||selected.some(x=>!uuid.safeParse(x).success)) fail("Sélection invalide");
 const {error}=await supabase.rpc("create_settlement",{p_merchant_id:merchant.data,p_shipment_ids:selected});
 if(error) fail(error.message);
 revalidatePath("/finance");redirect("/finance?success=1");
}
export async function markPaidAction(form:FormData){
 const {supabase}=await requireRole(financeRoles);
 const settlement=uuid.safeParse(form.get("settlement_id"));
 const reference=String(form.get("reference")||"").trim();
 if(!settlement.success||reference.length<3) fail("Référence paiement obligatoire");
 const {error}=await supabase.rpc("mark_settlement_paid",{p_settlement_id:settlement.data,p_reference:reference});
 if(error) fail(error.message);
 revalidatePath("/finance");redirect("/finance?success=1");
}
