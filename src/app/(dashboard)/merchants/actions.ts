"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { merchantInput,fromForm } from "@/lib/validation";
export async function createMerchantAction(form:FormData) {
 const {supabase,profile}=await requireRole(["super_admin","admin","manager"]);
 const parsed=merchantInput.safeParse(fromForm(form));
 if(!parsed.success) redirect("/merchants?error="+encodeURIComponent(parsed.error.issues[0]?.message||"Données invalides"));
 const {error}=await supabase.from("merchants").insert({...parsed.data,organization_id:profile.organization_id});
 if(error) redirect("/merchants?error="+encodeURIComponent(error.message));
 revalidatePath("/merchants");
 redirect("/merchants?success=1");
}
