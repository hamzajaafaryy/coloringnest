"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export async function loginAction(data: FormData) {
  const email=String(data.get("email")||"").trim();
  const password=String(data.get("password")||"");
  if(!email||!password) redirect("/login?error=Veuillez+remplir+les+deux+champs");
  const supabase=await createClient();
  const {error}=await supabase.auth.signInWithPassword({email,password});
  if(error) redirect("/login?error=Identifiants+incorrects");
  redirect("/dashboard");
}
