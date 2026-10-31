import { Boxes, AlertTriangle } from "lucide-react";
import { session } from "@/lib/auth";
import { Head,ErrorMessage,Empty,Stat } from "@/lib/ui";
import { stockRoles } from "@/lib/types";
import { createProductAction,moveStockAction } from "./actions";
export default async function StockPage({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}){
 const {supabase,profile}=await session();
 if(!["super_admin","admin","manager","warehouse","accountant"].includes(profile.role)) return <p className="alert">Accès interdit.</p>;
 const {error,success}=await searchParams;
 const [{data:products},{data:merchants}]=await Promise.all([
  supabase.from("products").select("id,sku,name,quantity,low_stock_threshold,merchant_id").order("name").limit(200),
  supabase.from("merchants").select("id,name").order("name")
 ]);
 const canEdit=stockRoles.includes(profile.role);
 const low=products?.filter(p=>p.quantity<=p.low_stock_threshold).length??0;
 return <><Head title="Stock & entrepôt" subtitle="Inventaire par marchand avec mouvements tracés."/>
 {success&&<div className="notice" style={{marginBottom:16}}>Opération enregistrée.</div>}<ErrorMessage message={error}/>
 <div className="stats" style={{gridTemplateColumns:"repeat(2,minmax(0,1fr))"}}>
 <Stat title="Références suivies" value={products?.length||0} icon={Boxes}/><Stat title="Alertes stock bas" value={low} icon={AlertTriangle}/></div>
 <div className="grid-2"><section className="panel"><h2>Inventaire</h2>{!products?.length?<Empty/>:<div className="table-wrap"><table><thead><tr><th>Référence</th><th>Produit</th><th>Disponible</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td className="mono">{p.sku}</td><td>{p.name}<div className="tiny">{merchants?.find(m=>m.id===p.merchant_id)?.name||""}</div></td><td><strong className={p.quantity<=p.low_stock_threshold?"danger-text":""}>{p.quantity}</strong></td></tr>)}</tbody></table></div>}</section>
 {canEdit&&<section className="panel"><h2>Créer une référence</h2><form action={createProductAction}>
 <div className="field"><label>Marchand</label><select name="merchant_id" required><option value="">Sélectionner</option>{merchants?.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
 <div className="field"><label>SKU unique</label><input name="sku" required placeholder="PROD-001"/></div>
 <div className="field"><label>Nom du produit</label><input name="name" required/></div>
 <div className="field"><label>Seuil d'alerte</label><input type="number" name="low_stock_threshold" defaultValue={10} min={0}/></div>
 <button type="submit" className="btn">Créer produit</button></form>
 <h2 style={{marginTop:28}}>Entrée / sortie de stock</h2><form action={moveStockAction}>
 <div className="field"><label>Produit</label><select name="product_id" required><option value="">Sélectionner</option>{products?.map(p=><option key={p.id} value={p.id}>{p.sku} — {p.name}</option>)}</select></div>
 <div className="field"><label>Quantité signée (+ entrée, - sortie)</label><input type="number" name="quantity_change" required placeholder="+20 ou -5"/></div>
 <div className="field"><label>Motif</label><input name="reason" required minLength={3} placeholder="Réception fournisseur"/></div>
 <button type="submit" className="btn">Valider mouvement</button>
 </form></section>}</div></>;
}
