import Link from "next/link";
import { BarChart3,Download,PackageCheck,TrendingUp,PackageX,Timer } from "lucide-react";
import { session } from "@/lib/auth";
import { Head,Stat,Pill,Empty } from "@/lib/ui";
import { mad } from "@/lib/format";
export default async function ReportsPage(){
 const {supabase,profile}=await session();
 if(!["super_admin","admin","manager","dispatcher","accountant"].includes(profile.role)) return <p className="alert">Accès interdit.</p>;
 const {data,error}=await supabase.from("shipments").select("id,status,cod_amount_mad,delivery_fee_mad,destination_city").order("created_at",{ascending:false}).limit(1000);
 if(error) throw new Error("Chargement des rapports impossible");
 const rows=data??[];
 const count=(status:string)=>rows.filter(s=>s.status===status).length;
 const delivered=rows.filter(s=>s.status==="delivered");
 const rate=rows.length?Math.round(delivered.length/rows.length*100):0;
 const cities=Object.entries(rows.reduce<Record<string,number>>((acc,s)=>{acc[s.destination_city]=(acc[s.destination_city]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]).slice(0,6);
 const max=cities[0]?.[1]||1;
 return <><Head title="Rapports & analyse" subtitle="Vue indicative sur les 1 000 expéditions récentes."><Link className="btn" href="/reports/export"><Download size={16}/> Export CSV</Link></Head>
 <div className="stats"><Stat title="Livraisons réussies" value={count("delivered")} icon={PackageCheck}/><Stat title="Taux livré / total" value={rate+" %"} icon={TrendingUp}/><Stat title="Refus ou retours" value={count("refused")+count("returned")} icon={PackageX}/><Stat title="Colis non terminés" value={rows.filter(s=>!["delivered","returned","cancelled"].includes(s.status)).length} icon={Timer}/></div>
 <div className="grid-2"><section className="panel"><h2>Villes les plus actives</h2>{!cities.length?<Empty/>:cities.map(([name,value])=><div key={name} style={{margin:"19px 0"}}><div className="row between"><strong>{name}</strong><span>{value} colis</span></div><div style={{height:9,background:"#eaf0f1",borderRadius:9,marginTop:8}}><div style={{height:9,width:(value/max*100)+"%",borderRadius:9,background:"#299e90"}}/></div></div>)}</section>
 <section className="panel"><h2>Résultat livraison / COD</h2><div className="detail"><span>Montant COD livré</span><strong>{mad(delivered.reduce((n,s)=>n+Number(s.cod_amount_mad),0))}</strong></div>
 <div className="detail"><span>Frais sur colis livrés</span><strong>{mad(delivered.reduce((n,s)=>n+Number(s.delivery_fee_mad),0))}</strong></div>
 <div className="detail"><span>Montant marchand théorique</span><strong>{mad(delivered.reduce((n,s)=>n+Number(s.cod_amount_mad)-Number(s.delivery_fee_mad),0))}</strong></div>
 <p className="footnote">Montants théoriques avant rapprochement physique. Consultez Finance pour les vrais encaissements et règlements.</p></section></div></>;
}
