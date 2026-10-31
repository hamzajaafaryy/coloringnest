import type { Metadata } from "next";
import { Truck } from "lucide-react";
import { loginAction } from "./actions";
export const metadata: Metadata = {title:"Connexion"};
export default async function LoginPage({searchParams}:{searchParams:Promise<{error?:string}>}) {
 const {error}=await searchParams;
 return <div className="login-wrap"><main className="login-card">
   <div className="brand-mark"><Truck size={22}/></div>
   <h1>Atlas Delivery</h1>
   <p className="subtitle" style={{marginBottom:28}}>Bienvenue. Connectez-vous à votre espace logistique.</p>
   {error && <div role="alert" className="alert">{error}</div>}
   <form action={loginAction}>
     <div className="field"><label htmlFor="email">Adresse e-mail</label><input id="email" name="email" type="email" required autoComplete="username" placeholder="admin@entreprise.ma"/></div>
     <div className="field"><label htmlFor="password">Mot de passe</label><input id="password" name="password" type="password" required autoComplete="current-password"/></div>
     <button className="btn" type="submit">Se connecter</button>
   </form>
   <p className="footnote">Accès réservé aux comptes invités par un administrateur.</p>
 </main></div>;
}
