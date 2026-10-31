import { Head,ErrorMessage,Empty } from "@/lib/ui";
import { session } from "@/lib/auth";
import { createDriverAction } from "./actions";
import { internalRoles } from "@/lib/types";
export default async function DriversPage({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}){
 const {supabase,profile}=await session();
 if(!internalRoles.includes(profile.role)) return <p className="alert">Accès interdit.</p>;
 const {error,success}=await searchParams;
 const {data,error:dbError}=await supabase.from("drivers").select("id,full_name,city,phone,active").order("full_name");
 if(dbError) throw new Error("Lecture des livreurs impossible");
 const canCreate=["super_admin","admin","manager","dispatcher"].includes(profile.role);
 return <><Head title="Livreurs" subtitle="Annuaire et attribution des colis aux livreurs."/>
 {success&&<div className="notice" style={{marginBottom:16}}>Livreur ajouté.</div>}<ErrorMessage message={error}/>
 <div className="grid-2"><section className="panel"><h2>Liste des livreurs</h2>{!data?.length?<Empty/>:<div className="table-wrap"><table><thead><tr><th>Nom</th><th>Ville</th><th>Téléphone</th><th>État</th></tr></thead><tbody>{data.map(d=><tr key={d.id}><td><strong>{d.full_name}</strong></td><td>{d.city}</td><td>{d.phone}</td><td>{d.active?"Actif":"Inactif"}</td></tr>)}</tbody></table></div>}</section>
 {canCreate&&<section className="panel"><h2>Ajouter un livreur</h2><form action={createDriverAction}>
 <div className="field"><label>Nom complet</label><input name="full_name" required/></div>
 <div className="field"><label>Téléphone</label><input name="phone"/></div>
 <div className="field"><label>Ville de service</label><input name="city"/></div>
 <button className="btn" type="submit">Ajouter livreur</button>
 </form></section>}</div>
 <p className="footnote">Pour donner au livreur accès à son espace, invitez-le dans Supabase Auth puis associez le profil au livreur.</p></>;
}
