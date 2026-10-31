import Link from "next/link";
import { notFound } from "next/navigation";
import { Package,Phone,MapPin,Truck,ClipboardList,Wallet } from "lucide-react";
import { session } from "@/lib/auth";
import { Head,Pill,ErrorMessage } from "@/lib/ui";
import { mad,shortDate } from "@/lib/format";
import { transitions,labels,editRoles,type ShipmentStatus } from "@/lib/types";
import { uuid } from "@/lib/validation";
import { assignDriverAction,setShipmentStatusAction } from "../actions";
export default async function ShipmentDetail({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string}>}){
 const {id}=await params;const {error}=await searchParams;
 if(!uuid.safeParse(id).success) notFound();
 const {supabase,profile}=await session();
 const {data:s}=await supabase.from("shipments").select("*").eq("id",id).single();
 if(!s) notFound();
 const [{data:events},{data:drivers},{data:merchants}]=await Promise.all([
  supabase.from("shipment_events").select("id,to_status,from_status,comment,created_at").eq("shipment_id",id).order("created_at",{ascending:false}),
  supabase.from("drivers").select("id,full_name").eq("active",true).order("full_name"),
  supabase.from("merchants").select("id,name").eq("id",s.merchant_id)
 ]);
 const canAssign=editRoles.includes(profile.role);
 const canChange=[...editRoles,"warehouse","driver"].includes(profile.role);
 const possibilities=transitions[s.status as ShipmentStatus]||[];
 const allowed=profile.role==="driver"?possibilities.filter(x=>["delivered","refused"].includes(x)):possibilities;
 return <><Head title={"Colis "+s.tracking_code} subtitle={"Créé le "+shortDate(s.created_at)}>
   <Link className="btn secondary" href="/shipments">Retour</Link><Pill status={s.status}/>
 </Head><ErrorMessage message={error}/>
 <div className="grid-2"><section className="panel"><h2><Package size={18} style={{verticalAlign:"middle",marginRight:7}}/>Informations de livraison</h2>
  <div className="detail"><span className="muted">Marchand</span><strong>{merchants?.[0]?.name||"—"}</strong></div>
  <div className="detail"><span className="muted"><Phone size={13}/> Destinataire</span><strong>{s.recipient_name} — {s.recipient_phone}</strong></div>
  <div className="detail"><span className="muted"><MapPin size={13}/> Adresse</span><span style={{textAlign:"right",maxWidth:280}}>{s.delivery_address}, {s.destination_city}</span></div>
  <div className="detail"><span className="muted"><Wallet size={13}/> Montant COD</span><strong>{mad(s.cod_amount_mad)}</strong></div>
  <div className="detail"><span className="muted">Frais de livraison</span><strong>{mad(s.delivery_fee_mad)}</strong></div>
  <div className="detail"><span className="muted">Livreur</span><strong>{drivers?.find(d=>d.id===s.driver_id)?.full_name||(s.driver_id?"Assigné":"Non assigné")}</strong></div>
  <div className="detail"><span className="muted">COD reçu par la société</span><strong>{s.cash_received_at?shortDate(s.cash_received_at):"Pas encore"}</strong></div>
  {s.notes&&<p className="notice" style={{marginTop:14}}>{s.notes}</p>}
  <p className="footnote"><Link href={"/track?code="+s.tracking_code}>Voir le suivi public</Link></p>
 </section>
 <section className="panel"><h2><Truck size={18} style={{verticalAlign:"middle",marginRight:7}}/>Opérations</h2>
 {canAssign&&<form action={assignDriverAction} style={{marginTop:16,marginBottom:24}}>
  <input type="hidden" name="id" value={s.id}/><div className="field"><label>Assigner un livreur</label><select name="driver_id" required defaultValue={s.driver_id||""}><option value="">Sélectionner un livreur</option>{drivers?.map(d=><option key={d.id} value={d.id}>{d.full_name}</option>)}</select></div><button className="btn secondary" type="submit">Assigner</button>
 </form>}
 {canChange&&allowed.length>0&&<form action={setShipmentStatusAction}>
   <input type="hidden" name="id" value={s.id}/><div className="field"><label>Nouvel état</label><select name="status" required>{allowed.map(status=><option value={status} key={status}>{labels[status]}</option>)}</select></div>
   <div className="field"><label>Note de suivi (optionnel)</label><textarea name="comment" maxLength={500} placeholder="Commentaire interne..."/></div>
   <button className="btn" type="submit">Mettre à jour le statut</button>
  </form>}
 {!canAssign&&(!canChange||allowed.length===0)&&<p className="muted">Aucune action disponible pour votre rôle ou l'état de ce colis.</p>}
 </section></div>
 <section className="panel" style={{marginTop:20}}><h2><ClipboardList size={18} style={{verticalAlign:"middle",marginRight:7}}/>Historique de suivi</h2>
 <div className="timeline">{events?.map(event=><div className="timeline-event" key={event.id}><div><Pill status={event.to_status}/></div><div className="tiny" style={{marginTop:6}}>{shortDate(event.created_at)}</div>{event.comment&&<p style={{marginBottom:0}}>{event.comment}</p>}</div>)}</div>
 </section></>;
}
