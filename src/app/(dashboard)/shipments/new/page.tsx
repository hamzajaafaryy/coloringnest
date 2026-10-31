import { session } from "@/lib/auth";
import { Head,ErrorMessage } from "@/lib/ui";
import { createShipmentAction } from "../actions";
import Link from "next/link";
export default async function NewShipment({searchParams}:{searchParams:Promise<{error?:string}>}){
 const {supabase,profile}=await session();
 const {error}=await searchParams;
 if(!["super_admin","admin","manager","dispatcher","merchant"].includes(profile.role)) return <p className="alert">Votre rôle ne permet pas la création de colis.</p>;
 const {data:merchants}=await supabase.from("merchants").select("id,name,default_fee_mad").eq("active",true).order("name");
 return <><Head title="Nouvelle expédition" subtitle="Créez une demande de collecte et de livraison."><Link className="btn secondary" href="/shipments">Retour aux colis</Link></Head>
 <ErrorMessage message={error}/><section className="panel"><form action={createShipmentAction}>
  <div className="form-grid">
   <div className="field"><label>Marchand</label><select name="merchant_id" required defaultValue={profile.merchant_id||""}>{!profile.merchant_id&&<option value="">Sélectionner</option>}{merchants?.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
   <div className="field"><label>Destinataire</label><input name="recipient_name" minLength={2} maxLength={100} required placeholder="Nom complet"/></div>
   <div className="field"><label>Téléphone marocain</label><input name="recipient_phone" required placeholder="06 12 34 56 78"/></div>
   <div className="field"><label>Ville</label><input name="destination_city" required placeholder="Casablanca"/></div>
   <div className="field" style={{gridColumn:"1 / -1"}}><label>Adresse de livraison</label><input name="delivery_address" minLength={5} required placeholder="Rue, quartier, résidence, étage..."/></div>
   <div className="field"><label>Montant contre-remboursement (MAD)</label><input name="cod_amount_mad" type="number" step=".01" min="0" defaultValue="0" required/></div>
   <div className="field"><label>Frais de livraison (MAD)</label><input name="delivery_fee_mad" type="number" step=".01" min="0" defaultValue="30" required readOnly={profile.role==="merchant"}/></div>
   <div className="field" style={{gridColumn:"1 / -1"}}><label>Instructions internes</label><textarea name="notes" maxLength={500} placeholder="Point de repère, créneau souhaité..."/></div>
  </div><button className="btn" type="submit">Enregistrer le colis</button>
 </form></section><p className="footnote">Pour les marchands, les frais réels sont automatiquement chargés depuis leur tarif contractuel.</p></>;
}
