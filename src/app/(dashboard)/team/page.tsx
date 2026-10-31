import { session } from "@/lib/auth";
import { Head,Empty } from "@/lib/ui";
export default async function TeamPage(){
 const {supabase,profile}=await session();
 if(!["super_admin","admin","manager"].includes(profile.role)) return <p className="alert">Accès interdit.</p>;
 const {data,error}=await supabase.from("profiles").select("id,full_name,role,created_at").order("full_name");
 if(error) throw new Error("Liste équipe indisponible");
 return <><Head title="Équipe & rôles" subtitle="Comptes autorisés dans votre société."/><section className="panel"><h2>Utilisateurs</h2>
 {!data?.length?<Empty/>:<div className="table-wrap"><table><thead><tr><th>Nom</th><th>Rôle</th><th>Accès</th></tr></thead><tbody>{data.map(u=><tr key={u.id}><td><strong>{u.full_name}</strong></td><td><span className="tag">{u.role}</span></td><td className="tiny">Compte provisionné</td></tr>)}</tbody></table></div>}
 </section><p className="footnote">Les invitations et changements de rôles se font uniquement via un administrateur Supabase de confiance. Aucune inscription publique ni élévation de droits depuis l'application.</p></>;
}
