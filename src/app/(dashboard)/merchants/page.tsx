import { Store } from "lucide-react";
import { session } from "@/lib/auth";
import { Head,ErrorMessage,Empty } from "@/lib/ui";
import { mad,shortDate } from "@/lib/format";
import { createMerchantAction } from "./actions";
import { internalRoles } from "@/lib/types";
export default async function MerchantsPage({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}){
 const {profile,supabase}=await session();
 if(!internalRoles.includes(profile.role)) return <p className="alert">Accès interdit.</p>;
 const {error,success}=await searchParams;
 const {data,error:dbError}=await supabase.from("merchants").select("id,name,phone,city,default_fee_mad,active,created_at").order("created_at",{ascending:false});
 if(dbError) throw new Error("Lecture des marchands impossible");
 const canCreate=["super_admin","admin","manager"].includes(profile.role);
 return <><Head title="Marchands" subtitle="Clients professionnels et tarification par contrat."/>{success&&<div className="notice" style={{marginBottom:18}}>Marchand ajouté.</div>}<ErrorMessage message={error}/>
 <div className="grid-2"><section className="panel"><h2><Store size={17}/> Répertoire marchands</h2>{!data?.length?<Empty/>:<div className="table-wrap"><table><thead><tr><th>Nom</th><th>Ville</th><th>Téléphone</th><th>Tarif</th></tr></thead><tbody>{data.map(m=><tr key={m.id}><td><strong>{m.name}</strong><div className="tiny">{shortDate(m.created_at)}</div></td><td>{m.city}</td><td>{m.phone}</td><td>{mad(m.default_fee_mad)}</td></tr>)}</tbody></table></div>}</section>
 {canCreate&&<section className="panel"><h2>Ajouter un marchand</h2><form action={createMerchantAction}>
  <div className="field"><label>Nom commercial</label><input name="name" required minLength={2}/></div>
  <div className="field"><label>Téléphone</label><input name="phone" placeholder="06..."/></div>
  <div className="field"><label>Ville</label><input name="city" placeholder="Casablanca"/></div>
  <div className="field"><label>Tarif livraison (MAD)</label><input name="default_fee_mad" type="number" step=".01" min="0" defaultValue="30" required/></div>
  <button type="submit" className="btn">Ajouter marchand</button>
 </form></section>}</div></>;
}
