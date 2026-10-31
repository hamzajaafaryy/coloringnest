import Link from "next/link";
import { PackagePlus, Search } from "lucide-react";
import { session } from "@/lib/auth";
import { Head,Pill,Empty } from "@/lib/ui";
import { mad, shortDate } from "@/lib/format";
import { statuses,statusText } from "@/lib/shipment-labels";
export default async function ShipmentsPage({searchParams}:{searchParams:Promise<{status?:string;q?:string}>}){
 const {supabase}=await session();
 const {status,q}=await searchParams;
 let query=supabase.from("shipments").select("id,tracking_code,recipient_name,recipient_phone,destination_city,cod_amount_mad,status,created_at").order("created_at",{ascending:false}).limit(100);
 if(status && statuses.includes(status as never)) query=query.eq("status",status);
 if(q?.trim()) query=query.ilike("tracking_code","%"+q.trim().replace(/[%_]/g,"")+"%");
 const {data,error}=await query;
 if(error) throw new Error("Chargement des colis impossible");
 return <><Head title="Colis & livraisons" subtitle="Gestion et suivi des expéditions (100 plus récentes)."><Link className="btn" href="/shipments/new"><PackagePlus size={16}/> Nouveau colis</Link></Head>
 <section className="panel"><form className="toolbar" method="get"><div style={{flex:"1 1 240px",maxWidth:400,position:"relative"}}><Search size={15} style={{position:"absolute",top:14,left:11,color:"#98a4b0"}}/><input className="search" style={{paddingLeft:35}} name="q" placeholder="Chercher une référence..." defaultValue={q}/></div>
 <select className="search" style={{width:190}} name="status" defaultValue={status||""}><option value="">Tous les statuts</option>{statuses.map(s=><option key={s} value={s}>{statusText(s)}</option>)}</select><button className="btn secondary" type="submit">Filtrer</button></form>
 {!data?.length?<Empty/>:<div className="table-wrap"><table><thead><tr><th>Référence</th><th>Destinataire</th><th>Ville</th><th>Montant COD</th><th>Statut</th><th>Création</th></tr></thead>
 <tbody>{data.map(s=><tr key={s.id}><td><Link className="mono" href={"/shipments/"+s.id}>{s.tracking_code}</Link></td><td><strong>{s.recipient_name}</strong><div className="tiny">{s.recipient_phone}</div></td><td>{s.destination_city}</td><td>{mad(s.cod_amount_mad)}</td><td><Pill status={s.status}/></td><td className="tiny">{shortDate(s.created_at)}</td></tr>)}</tbody></table></div>}
 </section></>;
}
