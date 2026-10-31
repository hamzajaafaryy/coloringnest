"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { driverInput,fromForm } from "@/lib/validation";
export async function createDriverAction(form:FormData) {
 const {supabase,profile}=await requireRole(["super_admin","admin","manager","dispatcher"]);
 const parsed=driverInput.safeParse(fromForm(form));
 if(!parsed.success) redirect("/drivers?error="+encodeURIComponent(parsed.error.issues[0]?.message||"Données invalides"));
 const {error}=await supabase.from("drivers").insert({...parsed.data,organization_id:profile.organization_id});
 if(error) redirect("/drivers?error="+encodeURIComponent(error.message));
 revalidatePath("/drivers"); redirect("/drivers?success=1");
}
