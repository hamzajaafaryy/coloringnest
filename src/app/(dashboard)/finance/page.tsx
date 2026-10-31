import { Wallet,CheckCircle2 } from "lucide-react";
import { session } from "@/lib/auth";
import { Head,ErrorMessage,Empty,Stat } from "@/lib/ui";
import { financeRoles } from "@/lib/types";
import { mad,shortDate } from "@/lib/format";
import { receiveCashAction,createSettlementAction,markPaidAction } from "./actions";
export default async function FinancePage({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}){
 const {supabase,profile}=await session();
 if(![...financeRoles,"merchant"].includes(profile.role)) return <p className="alert">Accès interdit.</p>;
 const {error,success}=await searchParams;
 const canEdit=financeRoles.includes(profile.role);
 const [{data:shipments},{data:settlements},{data:items},{data:merchants}]=await Promise.all([
  supabase.from("shipments").select("id,tracking_code,merchant_id,cod_amount_mad,delivery_fee_mad,cash_received_at,status").eq("status","delivered").order("created_at",{ascending:false}).limit(200),
  supabase.from("settlements").select("id,merchant_id,total_cod_mad,total_fees_mad,net_mad,status,created_at,payment_reference").order("created_at",{ascending:false}).limit(100),
  supabase.from("settlement_items").select("shipment_id").limit(1000),
  supabase.from("merchants").select("id,name")
 ]);
 const settled=new Set(items?.map(x=>x.shipment_id)||[]);
 const pending=shipments?.filter(s=>!s.cash_received_at)||[];
 const eligible=shipments?.filter(s=>s.cash_received_at&&!settled.has(s.id))||[];
 const groups=merchants?.map(m=>({...m,rows:eligible.filter(s=>s.merchant_id===m.id)})).filter(x=>x.rows.length)||[];
 const total=settlements?.reduce((n,s)=>n+Number(s.net_mad),0)||0;
 return <><Head title="COD & règlements" subtitle="Suivi des encaissements et paiements aux marchands."/>
 {success&&<div className="notice" style={{marginBottom:16}}>Opération comptable enregistrée.</div>}<ErrorMessage message={error}/>
 <div className="stats" style={{gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>
 <Stat title="Montant net des règlements affichés" value={mad(total)} icon={Wallet}/><Stat title="Règlements enregistrés" value={settlements?.length||0} icon={CheckCircle2}/></div>
 {canEdit&&<div className="grid-2">
 <section className="panel"><h2>1. Réception physique du COD</h2><p className="tiny">Ne confirmez qu'après vérification réelle de l'argent reçu du livreur.</p>
 {!pending.length?<Empty text="Aucun COD livré en attente de rapprochement."/>:<div className="table-wrap"><table><thead><tr><th>Colis</th><th>COD</th><th>Action</th></tr></thead><tbody>{pending.slice(0,40).map(s=><tr key={s.id}><td className="mono">{s.tracking_code}</td><td>{mad(s.cod_amount_mad)}</td><td><form action={receiveCashAction}><input type="hidden" name="shipment_id" value={s.id}/><button className="btn small" type="submit">Recevoir COD</button></form></td></tr>)}</tbody></table></div>}
 </section><section className="panel"><h2>2. Préparer un règlement marchand</h2>
 {!groups.length?<Empty text="Aucun colis rapproché à régler."/>:groups.map(g=><form action={createSettlementAction} key={g.id} style={{borderBottom:"1px solid #e3e8ee",paddingBottom:20,marginBottom:20}}>
 <input type="hidden" name="merchant_id" value={g.id}/><h3>{g.name}</h3>
 {g.rows.map(s=><label key={s.id} className="row" style={{padding:"6px 0"}}><input type="checkbox" name="shipment_id" value={s.id} defaultChecked/><span className="mono">{s.tracking_code}</span><span>{mad(Number(s.cod_amount_mad)-Number(s.delivery_fee_mad))}</span></label>)}
 <button className="btn small" type="submit" style={{marginTop:12}}>Créer règlement</button>
 </form>)}
 </section></div>}
 <section className="panel" style={{marginTop:20}}><h2>Historique des règlements</h2>
 {!settlements?.length?<Empty/>:<div className="table-wrap"><table><thead><tr><th>Marchand</th><th>COD</th><th>Frais</th><th>Net</th><th>Statut</th><th>Paiement</th></tr></thead><tbody>{settlements.map(s=><tr key={s.id}>
 <td><strong>{merchants?.find(m=>m.id===s.merchant_id)?.name||"Marchand"}</strong><div className="tiny">{shortDate(s.created_at)}</div></td>
 <td>{mad(s.total_cod_mad)}</td><td>{mad(s.total_fees_mad)}</td><td><strong>{mad(s.net_mad)}</strong></td>
 <td><span className={"tag status-"+s.status}>{s.status==="paid"?"Payé":"En attente"}</span></td>
 <td>{canEdit&&s.status==="pending"?<form action={markPaidAction} className="row"><input type="hidden" name="settlement_id" value={s.id}/><input className="search" style={{minWidth:125,width:135}} name="reference" placeholder="Réf. virement" minLength={3} required/><button className="btn small" type="submit">Payé</button></form>:<span className="tiny">{s.payment_reference||"—"}</span>}</td>
 </tr>)}</tbody></table></div>}</section>
 <p className="footnote">COD livré ≠ argent physiquement reçu. Les montants visibles sont limités aux 200 derniers colis livrés et 100 derniers règlements.</p>
 </>;
}
