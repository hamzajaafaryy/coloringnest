import Link from "next/link";
import { Truck,Search,MapPinned } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { Pill } from "@/lib/ui";
import { shortDate } from "@/lib/format";
export const dynamic="force-dynamic";
export const metadata={title:"Suivi de colis | Atlas Delivery",robots:{index:false,follow:false}};
export default async function TrackPage({searchParams}:{searchParams:Promise<{code?:string}>}){
 const {code:raw}=await searchParams;
 const code=String(raw||"").trim().toUpperCase();
 let shipment: {tracking_code:string;status:string;destination_city:string;created_at:string;updated_at:string}|null=null;
 let invalid=false;
 if(code){
  if(!/^AT-[A-F0-9]{20}$/.test(code)) invalid=true;
  else {
   try{
    const client=createAdminClient();
    const {data}=await client.from("shipments").select("tracking_code,status,destination_city,created_at,updated_at").eq("tracking_code",code).maybeSingle();
    shipment=data;
   }catch{invalid=true;}
  }
 }
 return <><header className="public-nav"><Link className="logo-inline" href="/track"><Truck size={20} style={{verticalAlign:"middle",marginRight:8}}/>Atlas Delivery</Link><Link href="/login" className="btn secondary small">Espace professionnel</Link></header>
 <main className="track-wrap"><div className="track-hero"><div className="brand-mark" style={{margin:"0 auto 15px"}}><MapPinned size={21}/></div><h1>Suivez votre colis</h1><p className="subtitle">Entrez votre référence de livraison pour connaître son avancement.</p></div>
 <section className="panel"><form method="get" action="/track" className="track-form"><input className="search" name="code" aria-label="Code de suivi" placeholder="AT-XXXXXXXXXXXXXXXXXXXX" defaultValue={code} maxLength={23} required/><button className="btn" type="submit"><Search size={16}/> Suivre</button></form>
 {code&&<div style={{marginTop:24}}>{shipment?<><div className="notice row between"><strong className="mono">{shipment.tracking_code}</strong><Pill status={shipment.status}/></div>
 <div className="detail"><span className="muted">Ville de destination</span><strong>{shipment.destination_city}</strong></div>
 <div className="detail"><span className="muted">Date création</span><strong>{shortDate(shipment.created_at)}</strong></div>
 <div className="detail"><span className="muted">Dernière mise à jour</span><strong>{shortDate(shipment.updated_at)}</strong></div></>:<div className="alert" role="status">{invalid?"Référence invalide ou suivi momentanément indisponible.":"Aucun colis trouvé avec cette référence."}</div>}</div>}
 </section><p className="footnote" style={{textAlign:"center"}}>Pour protéger vos données, seuls la ville et le statut du colis sont affichés.</p></main></>;
}
