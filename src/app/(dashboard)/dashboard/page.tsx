import Link from "next/link";
import { Package, Truck, CheckCircle2, Wallet, ArrowUpRight } from "lucide-react";
import { session } from "@/lib/auth";
import { Head,Stat,Pill,Empty } from "@/lib/ui";
import { mad, shortDate } from "@/lib/format";
export default async function DashboardPage(){
 const {supabase,profile}=await session();
 const [all,delivered,active,orders]=await Promise.all([
  supabase.from("shipments").select("id",{count:"exact",head:true}),
  supabase.from("shipments").select("id",{count:"exact",head:true}).eq("status","delivered"),
  supabase.from("shipments").select("id",{count:"exact",head:true}).in("status",["picked_up","in_transit","out_for_delivery"]),
  supabase.from("shipments").select("id,tracking_code,recipient_name,destination_city,cod_amount_mad,status,created_at").order("created_at",{ascending:false}).limit(8)
 ]);
 if(orders.error) throw new Error("Impossible de charger les livraisons");
 const rows=orders.data??[];
 const cod=rows.filter(x=>x.status==="delivered").reduce((n,x)=>n+Number(x.cod_amount_mad),0);
 return <>
  <Head title={"Bonjour, "+profile.full_name.split(" ")[0]+" 👋"} subtitle="Une vue d'ensemble de vos opérations de livraison.">
   <Link href="/shipments/new" className="btn"><Package size={17}/> Nouveau colis</Link>
  </Head>
  <section className="stats">
   <Stat title="Colis enregistrés" value={all.count??0} icon={Package} sub="Tous statuts"/>
   <Stat title="En circulation" value={active.count??0} icon={Truck} sub="Collectés et en cours"/>
   <Stat title="Colis livrés" value={delivered.count??0} icon={CheckCircle2} sub="Livraisons terminées"/>
   <Stat title="COD livré récent" value={mad(cod)} icon={Wallet} sub="Sur les 8 derniers colis seulement"/>
  </section>
  <section className="panel"><div className="row between" style={{marginBottom:12}}><h2 style={{margin:0}}>Dernières expéditions</h2><Link href="/shipments" className="btn secondary small">Toutes les expéditions <ArrowUpRight size={14}/></Link></div>
   {rows.length===0?<Empty text="Aucun colis pour le moment. Créez votre premier envoi."/>:<div className="table-wrap"><table><thead><tr><th>Référence</th><th>Destinataire</th><th>Ville</th><th>COD</th><th>Statut</th><th>Date</th></tr></thead>
   <tbody>{rows.map(o=><tr key={o.id}><td><Link className="mono" href={"/shipments/"+o.id}>{o.tracking_code}</Link></td><td>{o.recipient_name}</td><td>{o.destination_city}</td><td>{mad(o.cod_amount_mad)}</td><td><Pill status={o.status}/></td><td className="tiny">{shortDate(o.created_at)}</td></tr>)}</tbody></table></div>}
  </section>
  <p className="footnote">Les indicateurs respectent automatiquement les accès de votre compte.</p>
 </>;
}
