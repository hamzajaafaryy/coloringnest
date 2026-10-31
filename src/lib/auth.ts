import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types";
export async function session() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");
  const { data: profile, error: profileError } = await supabase
    .from("profiles").select("id,organization_id,full_name,role,merchant_id,driver_id")
    .eq("id", user.id).single();
  if (profileError || !profile) throw new Error("Compte non activé : contactez l'administrateur.");
  return { supabase, user, profile: profile as { id:string;organization_id:string;full_name:string;role:Role;merchant_id:string|null;driver_id:string|null } };
}
export async function requireRole(allowed: Role[]) {
  const ctx = await session();
  if (!allowed.includes(ctx.profile.role)) throw new Error("Accès interdit pour ce rôle");
  return ctx;
}
